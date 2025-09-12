// Application constants

export const MODBUS_CONSTANTS = {
  DEFAULT_PORT: 502,
  DEFAULT_TIMEOUT: 5000,
  MAX_UNIT_ID: 255,
  MIN_UNIT_ID: 1,
  MAX_ADDRESS: 65535,
  MIN_ADDRESS: 0,
  MAX_QUANTITY: 125,
  MIN_QUANTITY: 1,
  MAX_REGISTER_VALUE: 65535,
  MIN_REGISTER_VALUE: 0,
  CONFIG_UNIT_ID: 247, // Default unit ID for device configuration
  CONFIG_SAVE_ADDRESS: 503 // Address to trigger configuration save
} as const;

export const GRID_CONSTANTS = {
  DEFAULT_SIZE: 8,
  MAX_SIZE: 16,
  MIN_SIZE: 1
} as const;

export const UI_CONSTANTS = {
  TOAST_DURATION: 3000,
  STATUS_CHECK_INTERVAL: 5000,
  MAX_RESULTS: 10
} as const;

export const VALIDATION_MESSAGES = {
  UNIT_ID_RANGE: `Unit ID must be between ${MODBUS_CONSTANTS.MIN_UNIT_ID} and ${MODBUS_CONSTANTS.MAX_UNIT_ID}`,
  ADDRESS_RANGE: `Address must be between ${MODBUS_CONSTANTS.MIN_ADDRESS} and ${MODBUS_CONSTANTS.MAX_ADDRESS}`,
  QUANTITY_RANGE: `Quantity must be between ${MODBUS_CONSTANTS.MIN_QUANTITY} and ${MODBUS_CONSTANTS.MAX_QUANTITY}`,
  REGISTER_VALUE_RANGE: `Register value must be between ${MODBUS_CONSTANTS.MIN_REGISTER_VALUE} and ${MODBUS_CONSTANTS.MAX_REGISTER_VALUE}`,
  INVALID_NUMBER: 'Value must be a valid number',
  REQUIRED_FIELD: 'This field is required',
  NOT_CONNECTED: 'Not connected to Modbus server'
} as const;
