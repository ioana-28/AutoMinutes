export const getParticipantDisplayName = (
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null,
) => {
  const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim();

  if (fullName) {
    return fullName;
  }

  const fallbackEmail = email?.trim();
  return fallbackEmail || 'Unknown participant';
};

export const getParticipantFullName = (firstName?: string | null, lastName?: string | null) => {
  const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim();
  return fullName || 'Unknown participant';
};

export const getSearchableUserText = (
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null,
) => {
  const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim();
  return [email ?? '', firstName ?? '', lastName ?? '', fullName].join(' ').toLowerCase();
};
