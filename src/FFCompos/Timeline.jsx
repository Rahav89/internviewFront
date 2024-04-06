import React from 'react';


const Timeline = ({ stages }) => {
    return (
      <div className="timeline-container">
        {stages.map((stage, index) => (
          <React.Fragment key={index}>
            <div className={`circle ${stage.active ? 'active' : ''}`}>{stage.number}</div>
            {index !== stages.length - 1 && <div className="line"></div>} {/* Don't render line for the last item */}
          </React.Fragment>
        ))}
      </div>
    );
  };
export default Timeline;
