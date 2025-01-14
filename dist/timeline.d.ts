import React from 'react';
export interface TimelineEventClickHandler {
    (event: any): void;
}
export interface TimelineEvent {
    date: Date;
    title: string;
    imageUrl: string;
    text: string;
    onClick?: TimelineEventClickHandler | null;
    buttonText?: string | null;
    extras?: object | null;
}
export interface TimelineEventProps {
    event: TimelineEvent;
}
export interface TimelineCustomComponents {
    topLabel?: React.PureComponent<TimelineEventProps> | React.ReactNode | null;
    bottomLabel?: React.PureComponent<TimelineEventProps> | React.ReactNode | null;
    header?: React.PureComponent<TimelineEventProps> | React.ReactNode | null;
    imageBody?: React.PureComponent<TimelineEventProps> | React.ReactNode | null;
    textBody?: React.PureComponent<TimelineEventProps> | React.ReactNode | null;
    footer?: React.PureComponent<TimelineEventProps> | React.ReactNode | null;
}
export interface TimelineProps {
    customComponents?: TimelineCustomComponents | null;
    events: Array<TimelineEvent>;
    reverseOrder?: boolean;
    denseLayout?: boolean;
    imageIndexes?: Array<Number>;
}
declare const Timeline: React.MemoExoticComponent<(props: TimelineProps) => JSX.Element>;
export default Timeline;
