import { ScoredItem } from "@/types";

export function ScoreBadge({ item }: { item: ScoredItem }) {
  const maxScore = 100;
  const percentage = Math.min((item.score / maxScore) * 100, 100);

  let bgColor = "bg-gray-400";
  if (percentage >= 80) bgColor = "bg-green-500";
  else if (percentage >= 50) bgColor = "bg-yellow-500";
  else if (percentage >= 30) bgColor = "bg-orange-500";

  return (
    <div className="flex items-center gap-1">
      <div className={`w-2 h-2 rounded-full ${bgColor}`} />
      <span className="text-xs font-medium text-gray-600">{Math.round(item.score)} pts</span>
    </div>
  );
}