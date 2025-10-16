import { Avatar, AvatarFallback } from "./ui/avatar";

interface UserAvatarProps {
  name: string;
  className?: string;
}

export function UserAvatar({ name, className }: UserAvatarProps) {
  const getInitials = (name: string) => {
    const parts = name?.split(' ');
    if (parts?.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name?.slice(0, 2).toUpperCase();
  };

  const getColorFromName = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
    ];
    
    let hash = 0;
    for (let i = 0; i < name?.length; i++) {
      hash = name?.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Avatar className={className}>
      <AvatarFallback className={`${getColorFromName(name)} text-white`}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
