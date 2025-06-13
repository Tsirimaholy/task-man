export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class FormValidator {
  private errors: Record<string, string> = {};

  required(value: string | null | undefined, fieldName: string): this {
    if (!value || value.toString().trim().length === 0) {
      this.errors[fieldName] = `${fieldName} is required`;
    }
    return this;
  }

  minLength(value: string | null | undefined, min: number, fieldName: string): this {
    if (value && value.toString().trim().length < min) {
      this.errors[fieldName] = `${fieldName} must be at least ${min} characters`;
    }
    return this;
  }

  maxLength(value: string | null | undefined, max: number, fieldName: string): this {
    if (value && value.toString().length > max) {
      this.errors[fieldName] = `${fieldName} must be less than ${max} characters`;
    }
    return this;
  }

  email(value: string | null | undefined, fieldName: string): this {
    if (value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.toString())) {
        this.errors[fieldName] = `${fieldName} must be a valid email address`;
      }
    }
    return this;
  }

  custom(condition: boolean, fieldName: string, message: string): this {
    if (!condition) {
      this.errors[fieldName] = message;
    }
    return this;
  }

  getResult(): ValidationResult {
    return {
      isValid: Object.keys(this.errors).length === 0,
      errors: { ...this.errors },
    };
  }

  static validate(): FormValidator {
    return new FormValidator();
  }
}

// Helper function for common project validation
export function validateProjectData(data: {
  name?: string | null;
  description?: string | null;
}) {
  return FormValidator.validate()
    .required(data.name, "Project name")
    .minLength(data.name, 2, "Project name")
    .maxLength(data.name, 100, "Project name")
    .maxLength(data.description, 500, "Description")
    .getResult();
}

// Helper function for common task validation
export function validateTaskData(data: {
  title?: string | null;
  description?: string | null;
}) {
  return FormValidator.validate()
    .required(data.title, "Task title")
    .minLength(data.title, 2, "Task title")
    .maxLength(data.title, 200, "Task title")
    .maxLength(data.description, 1000, "Description")
    .getResult();
}

// Helper function for user validation
export function validateUserData(data: {
  email?: string | null;
  name?: string | null;
  password?: string | null;
}) {
  return FormValidator.validate()
    .required(data.email, "Email")
    .email(data.email, "Email")
    .required(data.name, "Name")
    .minLength(data.name, 2, "Name")
    .maxLength(data.name, 100, "Name")
    .required(data.password, "Password")
    .minLength(data.password, 6, "Password")
    .getResult();
}