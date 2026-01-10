import React from 'react';
import Tilt from 'react-parallax-tilt';

const Card = ({ children, className = '', highlight = false, ...props }) => {
    return (
        <Tilt
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            glareEnable={true}
            glareMaxOpacity={0.15}
            glareColor="var(--primary)"
            glarePosition="all"
            scale={1.02}
            className={`
        glass-card rounded-[var(--radius-md)] p-4 
        ${highlight ? 'border-[var(--primary)] shadow-[0_0_20px_-5px_var(--primary-glow)]' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </Tilt>
    );
};

export default Card;
