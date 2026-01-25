/**
 * CoCoA MVP - Forms Service
 * Handles conversational form completion
 */

import { Env, Session, IO, Auction } from '../types';

export interface FormState {
  formType: 'io_contribute' | 'auction_bid';
  step: number;
  data: Record<string, unknown>;
  completed: boolean;
}

// Form field definitions
const FORM_DEFINITIONS = {
  io_contribute: {
    fields: [
      { name: 'io_id', prompt: 'Which IO would you like to contribute to?', type: 'string', required: true },
      { name: 'stake_amount', prompt: 'How much COMM would you like to stake?', type: 'number', required: true },
      { name: 'confirm', prompt: 'Ready to submit? (yes/no)', type: 'boolean', required: true },
    ],
  },
  auction_bid: {
    fields: [
      { name: 'auction_id', prompt: 'Which auction would you like to bid on?', type: 'string', required: true },
      { name: 'bid_amount', prompt: 'How much COMM would you like to bid?', type: 'number', required: true },
      { name: 'confirm', prompt: 'Ready to place your sealed bid? (yes/no)', type: 'boolean', required: true },
    ],
  },
};

export function initializeForm(formType: 'io_contribute' | 'auction_bid', initialData?: Record<string, unknown>): FormState {
  return {
    formType,
    step: 0,
    data: initialData || {},
    completed: false,
  };
}

export function getNextPrompt(formState: FormState): string | null {
  const definition = FORM_DEFINITIONS[formState.formType];
  const currentField = definition.fields[formState.step];
  
  if (!currentField) {
    return null; // Form complete
  }
  
  // Skip fields that are already filled
  if (formState.data[currentField.name] !== undefined) {
    formState.step++;
    return getNextPrompt(formState);
  }
  
  return currentField.prompt;
}

export function processFormInput(formState: FormState, input: string): { success: boolean; error?: string } {
  const definition = FORM_DEFINITIONS[formState.formType];
  const currentField = definition.fields[formState.step];
  
  if (!currentField) {
    return { success: false, error: 'Form already completed' };
  }
  
  // Parse input based on field type
  let value: unknown;
  
  switch (currentField.type) {
    case 'number':
      value = parseInt(input, 10);
      if (isNaN(value as number)) {
        return { success: false, error: 'Please enter a valid number' };
      }
      break;
    case 'boolean':
      const lower = input.toLowerCase();
      if (['yes', 'y', 'confirm', 'true', '1'].includes(lower)) {
        value = true;
      } else if (['no', 'n', 'cancel', 'false', '0'].includes(lower)) {
        value = false;
      } else {
        return { success: false, error: 'Please respond with yes or no' };
      }
      break;
    default:
      value = input.trim();
  }
  
  formState.data[currentField.name] = value;
  formState.step++;
  
  // Check if form is complete
  if (formState.step >= definition.fields.length) {
    formState.completed = true;
  }
  
  return { success: true };
}

export function isFormComplete(formState: FormState): boolean {
  return formState.completed;
}

export function getFormSummary(formState: FormState): string {
  const { formType, data } = formState;
  
  if (formType === 'io_contribute') {
    return `IO Contribution:
• IO: ${data.io_id}
• Stake: ${data.stake_amount} COMM
• Confirmed: ${data.confirm ? 'Yes' : 'No'}`;
  }
  
  if (formType === 'auction_bid') {
    return `VAM Bid:
• Auction: ${data.auction_id}
• Bid Amount: ${data.bid_amount} COMM
• Confirmed: ${data.confirm ? 'Yes' : 'No'}`;
  }
  
  return 'Unknown form type';
}
