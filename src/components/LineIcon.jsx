// Simplified LINE brand mark: green rounded-square with the
// classic speech-bubble silhouette (used for the LINE auth buttons).
function LineIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#06C755" />
      <path
        fill="#fff"
        d="M12 5.4c-4.08 0-7.4 2.66-7.4 5.94 0 2.94 2.63 5.4 6.18 5.86.24.05.57.16.65.37.08.19.05.49.02.68l-.11.65c-.03.19-.15.75.65.41.8-.34 4.3-2.53 5.87-4.34 1.08-1.19 1.6-2.4 1.6-3.63 0-3.28-3.32-5.94-7.4-5.94h-.06z"
      />
    </svg>
  );
}

export default LineIcon;
