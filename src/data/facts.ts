import { FactItem } from '../types/quiz';
import factsData from './facts_index.json';

export const ALL_FACTS: FactItem[] = factsData as FactItem[];

export const ALL_FACT_CATEGORIES: string[] = Array.from(
  new Set(ALL_FACTS.map(f => f.category))
);

export const ALL_FACT_SECTIONS: string[] = Array.from(
  new Set(ALL_FACTS.map(f => f.section))
);

export const getFactsByCategory = (category: string): FactItem[] => {
  return ALL_FACTS.filter(f => f.category === category);
};

export const getFactById = (factId: string): FactItem | undefined => {
  return ALL_FACTS.find(f => f.id === factId);
};
