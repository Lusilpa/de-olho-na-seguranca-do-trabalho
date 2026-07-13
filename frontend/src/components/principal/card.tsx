import React from 'react';

interface CardProps {
  mainValue: string | number;
  subtitle: string;
  bottomLabel?: string;
  bottomValue?: React.ReactNode;
  progress?: number;
  icon: React.ReactNode;
  color?: 'orange' | 'red' | 'green' | 'blue' | 'purple';
}

const themeStyles = {
  orange: {
    iconBg: "bg-orange-50",
    iconText: "text-orange-500",
    progressFill: "bg-orange-400"
  },
  red: {
    iconBg: "bg-red-50",
    iconText: "text-red-500",
    progressFill: "bg-red-400"
  },
  green: {
    iconBg: "bg-green-50",
    iconText: "text-green-500",
    progressFill: "bg-green-400"
  },
  blue: {
    iconBg: "bg-blue-50",
    iconText: "text-blue-500",
    progressFill: "bg-blue-400"
  },
  purple: {
    iconBg: "bg-purple-50",
    iconText: "text-purple-500",
    progressFill: "bg-purple-400"
  }
};

export function Card({ 
  mainValue, 
  subtitle, 
  bottomLabel, 
  bottomValue, 
  progress, 
  icon, 
  color = 'orange'
}: CardProps) {
  
  const theme = themeStyles[color] || themeStyles.orange;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col w-full min-w-280px">
      
      {/*  Ícone + Textos Principais */}
      <div className="flex items-center gap-4">
        
        {/* Caixa do Ícone */}
        <div className={`${theme.iconBg} ${theme.iconText} p-3 rounded-xl flex items-center justify-center`}>
          {icon}
        </div>

        {/* Textos Principais */}
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-gray-800 leading-none mb-1">
            {mainValue}
          </span>
          <span className="text-sm text-gray-400 font-medium">
            {subtitle}
          </span>
        </div>
      </div>

      {/* LINHA INFERIOR: Barra de Progresso */}
      {(bottomLabel || progress !== undefined) && (
        <div className="mt-6">
          
          {/* Rótulos da Barra */}
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-gray-500 font-medium">{bottomLabel}</span>
            <span className="text-gray-700 font-semibold">{bottomValue}</span>
          </div>
          
          {/* Fundo da Barra */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            {/* Preenchimento Colorido da Barra */}
            <div 
              className={`h-full rounded-full ${theme.progressFill} transition-all duration-1000 ease-out`}
              style={{ width: `${progress || 0}%` }}
            ></div>
          </div>
          
        </div>
      )}
      
    </div>
  );
}