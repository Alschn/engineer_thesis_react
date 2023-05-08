const defaultOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
};

export function formatDate(
  date: string | Date,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObject = new Date(date);
  const i18nDateFormat = new Intl.DateTimeFormat(locale, {
    ...defaultOptions,
    ...options
  });
  return i18nDateFormat.format(dateObject);
}
