const timeAgo = x => {
  const now = Math.floor(Date.now() / 1000);
  const ago = now - Math.floor(x / 1000);

  if (ago < 60) {
    return 'Vừa xong';
  } else if (ago < 3600) {
    return `${Math.floor(ago / 60)} phút`;
  } else if (ago < 86400) {
    return `${Math.floor(ago / 3600)} giờ`;
  } else if (ago < 86400 * 30) {
    return `${Math.floor(ago / 86400)} ngày`;
  } else if (ago < 86400 * 365) {
    return `${Math.floor(ago / (86400 * 30))} tháng`;
  } else {
    return `${Math.floor(ago / (86400 * 365))} năm`;
  }
};

export default timeAgo;
