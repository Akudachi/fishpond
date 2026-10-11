export interface ValidationResult {
  isValid: boolean;
  errors: {
    student_name?: string;
    challenge_text?: string;
  };
}

export function validateChallengeSubmission(data: {
  student_name: string;
  challenge_text: string;
}): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  // Validate student_name (REQUIRED)
  const trimmedName = (data.student_name || '').trim();
  if (!trimmedName) {
    errors.student_name = 'Your name is required.';
  } else if (trimmedName.length < 2) {
    errors.student_name = 'Name must be at least 2 characters.';
  } else if (trimmedName.length > 60) {
    errors.student_name = 'Name cannot exceed 60 characters.';
  }

  // Validate challenge_text (REQUIRED)
  const trimmedText = (data.challenge_text || '').trim();
  if (!trimmedText) {
    errors.challenge_text = 'Challenge text is required and cannot be empty.';
  } else if (trimmedText.length < 5) {
    errors.challenge_text = 'Challenge text must be at least 5 characters long.';
  } else if (trimmedText.length > 250) {
    errors.challenge_text = `Challenge text is too long (${trimmedText.length}/250 characters).`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
