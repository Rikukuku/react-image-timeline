import React, { Component } from 'react';
import PropTypes from 'prop-types';

interface EventProps {
  date: Date,
  title: string,
  imageUrl: string,
  text: string,
  onClick: func|null,
  buttonText: string|null,
  extras: object|null,
}

interface TimelineProps {
  customComponents: {
    topLabel: func|null,
    bottomLabel: func|null,
    header: func|null,
    imageBody: func|null,
    textBody: func|null,
    footer: func|null,
  }|null
  events: Array<EventProps>
  reverseOrder: boolean
}

const isNonZeroArray = a => Array.isArray(a) && a.length > 0;

const takeFirst = a => (isNonZeroArray(a) ? a[0] : null);

const takeLast = a => (isNonZeroArray(a) ? a[a.length - 1] : null);

const isValidDate = date => {
  return date && date instanceof Date && !isNaN(date.getTime());
};

const formattedYear = date => {
  return isValidDate(date) ? String(date.getFullYear()) : '-';
};

const formattedDate = date => {
  if (!isValidDate(date)) return '-';
  const day = String(date.getDate());
  const month = String(date.getMonth() + 1);
  const year = String(date.getFullYear());
  return `${month.length > 1 ? month : '0' + month}/${day.length > 1 ? day : '0' + day}/${year}`;
};

const Dot = React.memo(function Dot(props) {
  return (
    <svg className="rt-dot" viewBox="0 0 8 10">
      <circle cx="4" cy="5" r="3" stroke="none" />
    </svg>
  );
});

const Arrow = React.memo(function Arrow(props) {
  return (
    <svg className="rt-arrow" viewBox="0 0 6 8">
      <g>
        <path d="M 0 0 L 6 4 L 0 8 L 0 0" />
      </g>
    </svg>
  );
});

const DefaultTopLabel = React.memo(function DefaultTopLabel({event}: EventProps) {
  return <div className="rt-label">{formattedYear(event.date)}</div>;
});

const DefaultBottomLabel = React.memo(function DefaultBottomLabel({event}: EventProps) {
  return <div className="rt-label">{formattedYear(event.date)}</div>;
});

const DefaultHeader = React.memo(function DefaultHeader({event}: EventProps) {
  return (
    <div>
      <h2 className="rt-title">{event.title}</h2>
      <p className="rt-date">{formattedDate(event.date)}</p>
    </div>
  );
});

const DefaultFooter = React.memo(function DefaultFooter({event}: EventProps) {
  const handleClick = e => {
    e.preventDefault();
    (event.onClick || (x => x))(e);
  };
  return (
    <button className="rt-btn" href="#" onClick={handleClick}>
      {event.buttonText || ''}
    </button>
  );
});

const DefaultTextBody = React.memo(function DefaultTextBody({event}: EventProps) {
  return (
    <div>
      <p>{event.text}</p>
    </div>
  );
});

const DefaultImageBody = React.memo(function DefaultImageBody({event}: EventProps) {
  return (
    <div>
      <img src={event.imageUrl} alt="" className="rt-image" />
    </div>
  );
});

const ArrowAndDot = React.memo(function ArrowAndDot(props) {
  return (
    <div className="rt-svg-container">
      <Arrow />
      <Dot />
    </div>
  );
});

const Clear = React.memo(function Clear(props) {
  return <li key="clear" className="rt-clear" />;
});

const Timeline = React.memo(function Timeline({ events, customComponents, reverseOrder }: TimelineProps) {

  // Obey sorting
  const sortedEvents = events
        .slice(0)
        .filter(({ date }) => isValidDate(date))
        .sort((a, b) => {
          return reverseOrder ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date);
        });

  // Render nothing with empty events
  if (!sortedEvents.length) {
    return <div />;
  }

  // Use custom component when provided
  const { topLabel, bottomLabel, header, footer, imageBody, textBody } = customComponents || {};
  const TopComponent = topLabel || DefaultTopLabel;
  const BottomComponent = bottomLabel || DefaultBottomLabel;
  const HeaderComponent = header || DefaultHeader;
  const ImageBodyComponent = imageBody || DefaultImageBody;
  const TextBodyComponent = textBody || DefaultTextBody;
  const FooterComponent = footer || DefaultFooter;

  return (
    <div className="rt-timeline-container">
      <ul className="rt-timeline">
        <li key="top" className="rt-label-container">
          <TopComponent event={takeFirst(sortedEvents)} />
        </li>
        {sortedEvents.map((event, index) => {
          return (
            <li className="rt-event" key={index}>
              <div className="rt-backing">
                <ArrowAndDot />
                <div className="rt-content">
                  <div className="rt-header-container">
                    <HeaderComponent event={event} />
                  </div>
                  <div className="rt-image-container">
                    <ImageBodyComponent event={event} />
                  </div>
                  <div className="rt-text-container">
                    <TextBodyComponent event={event} />
                  </div>
                  <div className="rt-footer-container">
                    <FooterComponent event={event} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
        <Clear />
        <li key="bottom" className="rt-label-container">
          <BottomComponent event={takeLast(sortedEvents)} />
        </li>
      </ul>
    </div>
  );
});

Timeline.displayName = 'Timeline';

Timeline.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.instanceOf(Date).isRequired,
      title: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      buttonText: PropTypes.string,
      extras: PropTypes.object,
    })
  ).isRequired,
  customComponents: PropTypes.shape({
    topLabel: PropTypes.func,
    bottomLabel: PropTypes.func,
    header: PropTypes.func,
    imageBody: PropTypes.func,
    textBody: PropTypes.func,
    footer: PropTypes.func,
  }),
  reverseOrder: PropTypes.bool,
};

export default Timeline;
