export const getTierColor = (tier: string): string => {
  const tierLower = tier.toLowerCase();

  switch (tierLower) {
    case 'iron':
      return 'text-iron';
    case 'bronze':
      return 'text-bronze';
    case 'silver':
      return 'text-silver';
    case 'gold':
      return 'text-gold';
    case 'platinum':
      return 'text-platinum';
    case 'diamond':
      return 'text-diamond';
    case 'master':
      return 'text-master';
    case 'grandmaster':
      return 'text-grandmaster';
    case 'challenger':
      return 'text-challenger';
    default:
      return 'text-foreground';
  }
};
