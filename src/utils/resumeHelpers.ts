
export const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const formatDateRange = (startDate: string, endDate: string, current: boolean) => {
  const start = formatDate(startDate);
  const end = current ? 'Present' : formatDate(endDate);
  return `${start} - ${end}`;
};

export const formatDescriptionAsBullets = (description: string) => {
  if (!description) return [];
  
  const sentences = description
    .split(/[.;]\s*|\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  return sentences;
};
