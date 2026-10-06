import { afterEach, describe, expect, it, vi } from 'vitest';
// @ts-expect-error Node launcher has no frontend declarations.
import { localAddresses, probeFut360 } from '../tools/start-local.mjs';

afterEach(() => vi.unstubAllGlobals());
describe('Inicio local sin modificar otros servicios', () => {
  const address = (value: string, internal = false) => ({
    family: 'IPv4',
    address: value,
    internal,
  });
  it('elige Wi-Fi privada y no publica por VPN, interfaz virtual o dirección pública', () => {
    expect(
      localAddresses({
        'Wi-Fi': [address('192.168.20.4')],
        Ethernet: [address('10.2.0.3')],
        VPN: [address('10.1.0.5')],
      }),
    ).toEqual(['192.168.20.4']);
    expect(
      localAddresses({
        'vEthernet (WSL)': [address('172.18.0.1')],
        Tailscale: [address('10.4.2.8')],
        Public: [address('8.8.8.8')],
        Loopback: [address('127.0.0.1', true)],
        Invalid: [address('192.168.2.999')],
      }),
    ).toEqual([]);
    expect(
      localAddresses({ Ethernet: [address('172.16.0.3'), address('172.16.0.4')] }),
    ).toHaveLength(2);
  });
  it('solo reutiliza Fut360 con el mismo build', async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ name: 'Fut360 · Jugador Total Coach', id: '/' })),
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ version: 'expected' })));
    vi.stubGlobal('fetch', request);
    expect(await probeFut360('http://127.0.0.1:4173', 'expected')).toBe('ready');
    expect(request.mock.calls[1]![0]).toBe('http://127.0.0.1:4173/offline.json');
  });
  it('no considera libre un puerto ocupado por otra app ni otro build', async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ name: 'Another app', id: '/' })))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ name: 'Fut360 · Jugador Total Coach', id: '/' })),
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ version: 'older' })));
    vi.stubGlobal('fetch', request);
    expect(await probeFut360('http://127.0.0.1:4173', 'expected')).toBe('other');
    expect(await probeFut360('http://127.0.0.1:4173', 'expected')).toBe('different-build');
  });
  it('distingue conexión rechazada de fallo de permisos/red antes de iniciar', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockRejectedValueOnce({ cause: { code: 'ECONNREFUSED' } })
        .mockRejectedValueOnce({ cause: { code: 'EPERM' } }),
    );
    expect(await probeFut360('http://127.0.0.1:4173', 'expected')).toBe('absent');
    expect(await probeFut360('http://127.0.0.1:4173', 'expected')).toBe('unreachable');
  });
});
