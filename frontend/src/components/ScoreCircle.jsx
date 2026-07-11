function ScoreCircle({ score }) {
  const radius = 54;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return "stroke-green-500";
    if (score >= 50) return "stroke-yellow-500";
    return "stroke-red-500";
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-slate-700"
        />

        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={`${getColor()} transition-all duration-700`}
          transform={`rotate(-90 ${radius} ${radius})`}
        />

        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-white text-2xl font-bold"
        >
          {score}%
        </text>
      </svg>
    </div>
  );
}

export default ScoreCircle;