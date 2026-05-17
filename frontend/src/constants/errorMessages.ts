export const ERROR_MESSAGES = {
  // Auth
  AUTH_INVALID_CREDENTIALS: 'Wrong email or password',
  AUTH_REQUIRED_FIELDS: 'Please fill in all required fields.',
  AUTH_INVALID_EMAIL: 'Please enter a valid email address.',
  AUTH_INVALID_LOGIN_RESPONSE: 'Invalid login response.',
  AUTH_INVALID_SIGNUP_RESPONSE: 'Invalid signup response.',
  AUTH_UNABLE_TO_AUTHENTICATE: 'Unable to authenticate.',

  // Meetings
  MEETINGS_LOAD_FAILED: 'Unable to load meetings right now.',
  MEETING_LOAD_FAILED: 'Unable to load meeting.',
  MEETING_TITLE_REQUIRED: 'Meeting title is required.',
  MEETING_SAVE_FAILED: 'Unable to save meeting changes.',
  MEETING_DELETE_FAILED: 'Unable to delete meeting.',
  MEETING_CREATE_FAILED: 'Unable to create meeting right now.',
  MEETING_CREATE_NO_USER: 'Unable to create a meeting without a user id.',

  // Action Items
  ACTION_ITEMS_LOAD_FAILED: 'Failed to load action items.',
  ACTION_ITEM_SAVE_FAILED: 'Failed to save action item.',
  ACTION_ITEM_UPDATE_FAILED: 'Failed to update action item.',
  ACTION_ITEM_DELETE_FAILED: 'Failed to delete action item.',
  ACTION_ITEM_DESCRIPTION_REQUIRED: 'Please add a description for the action item.',
  ACTION_ITEM_REMOVE_FAILED: 'Unable to remove action item.',

  // Users / Participants
  USERS_LOAD_FAILED: 'Unable to load users.',
  PARTICIPANTS_LOAD_FAILED: 'Unable to load participants.',
  USER_STATUS_UPDATE_FAILED: 'Unable to update user status.',
  PARTICIPANT_ALREADY_EXISTS: 'Participant is already in this meeting.',
  PARTICIPANT_ADD_FAILED: 'Unable to add participant.',
  PARTICIPANT_REMOVE_FAILED: 'Unable to remove participant.',

  // General / API
  API_REQUEST_FAILED: (status: number | string) => `Request failed with status ${status}`,
  API_FETCH_DOCUMENT_FAILED: (status: number | string) => `Failed to fetch document: ${status}`,
  API_FETCH_TRANSCRIPT_FAILED: (status: number | string) => `Failed to fetch transcript metadata: ${status}`,
  API_GENERIC_ERROR: 'An unexpected error occurred.',
};
