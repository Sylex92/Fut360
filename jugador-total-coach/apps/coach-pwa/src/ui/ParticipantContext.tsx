import { createContext, useContext } from 'react';
import type { Participant } from '../platform/participant';
import { trainingStore } from '../platform/training-store';
import type { TrainingStore } from '../platform/training-store';

export const ParticipantContext = createContext<{
  participant: Participant | null;
  store: TrainingStore;
}>({ participant: null, store: trainingStore });
export const useParticipant = () => useContext(ParticipantContext);
