export default function IsometricBuilding() {
  return (
    <div className="isometric-building">
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8a9bab" />
            <stop offset="100%" stopColor="#6B7F8E" />
          </linearGradient>
        </defs>
        <polygon
          points="200,50 350,130 200,210 50,130"
          stroke="#6B7F8E"
          strokeWidth="1"
          fill="rgba(107,127,142,0.1)"
        />
        <polygon
          points="200,210 350,130 350,180 200,260"
          stroke="#6B7F8E"
          strokeWidth="1"
          fill="rgba(18,32,47,0.5)"
        />
        <polygon
          points="200,210 50,130 50,180 200,260"
          stroke="#6B7F8E"
          strokeWidth="1"
          fill="rgba(18,32,47,0.3)"
        />
        <polygon
          points="200,260 350,180 350,230 200,310"
          stroke="#6B7F8E"
          strokeWidth="1"
          fill="rgba(18,32,47,0.5)"
        />
        <polygon
          points="200,260 50,180 50,230 200,310"
          stroke="#6B7F8E"
          strokeWidth="1"
          fill="rgba(18,32,47,0.3)"
        />
        <polygon
          points="200,310 350,230 350,280 200,360"
          stroke="#6B7F8E"
          strokeWidth="1"
          fill="rgba(18,32,47,0.5)"
        />
        <polygon
          points="200,310 50,230 50,280 200,360"
          stroke="#6B7F8E"
          strokeWidth="1"
          fill="rgba(18,32,47,0.3)"
        />
        <polygon
          points="200,50 350,130 200,210 50,130"
          stroke="url(#steelGrad)"
          strokeWidth="2"
          fill="rgba(107,127,142,0.12)"
        />
        <rect
          x="115"
          y="145"
          width="20"
          height="25"
          transform="skewY(-26)"
          stroke="#8a9bab"
          strokeWidth="0.5"
          fill="none"
        />
        <rect
          x="265"
          y="145"
          width="20"
          height="25"
          transform="skewY(-26)"
          stroke="#8a9bab"
          strokeWidth="0.5"
          fill="none"
        />
        <rect
          x="115"
          y="195"
          width="20"
          height="25"
          transform="skewY(-26)"
          stroke="#8a9bab"
          strokeWidth="0.5"
          fill="none"
        />
        <rect
          x="265"
          y="195"
          width="20"
          height="25"
          transform="skewY(-26)"
          stroke="#8a9bab"
          strokeWidth="0.5"
          fill="none"
        />
        <line x1="50" y1="130" x2="350" y2="130" stroke="#6B7F8E" strokeWidth="0.3" strokeDasharray="3 3" />
        <line x1="50" y1="180" x2="350" y2="180" stroke="#6B7F8E" strokeWidth="0.3" strokeDasharray="3 3" />
        <line x1="50" y1="230" x2="350" y2="230" stroke="#6B7F8E" strokeWidth="0.3" strokeDasharray="3 3" />
        <line x1="50" y1="280" x2="350" y2="280" stroke="#6B7F8E" strokeWidth="0.3" strokeDasharray="3 3" />
      </svg>
    </div>
  );
}
