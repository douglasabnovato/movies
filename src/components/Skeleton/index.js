import React from "react";
import "./styles.css";

export function MovieCardSkeleton() {
  return (
    <div className="film-skeleton">
      <div className="skeleton-poster pulse"></div>
      <div className="skeleton-title pulse"></div>
      <div className="skeleton-date pulse"></div>
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="details-skeleton">
      <div className="skeleton-banner pulse"></div>
      <div className="skeleton-info">
        <div className="skeleton-line title pulse"></div>
        <div className="skeleton-line sub pulse"></div>
        <div className="skeleton-circle pulse"></div>
        <div className="skeleton-line text pulse"></div>
        <div className="skeleton-line text pulse"></div>
      </div>
    </div>
  );
}