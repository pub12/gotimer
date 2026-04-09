interface YouTubeProps {
  id: string;
  title?: string;
  start?: number;
}

export function YouTube({ id, title = "YouTube video", start }: YouTubeProps) {
  const src = start
    ? `https://www.youtube-nocookie.com/embed/${id}?start=${start}`
    : `https://www.youtube-nocookie.com/embed/${id}`;

  return (
    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full rounded-lg"
      />
    </div>
  );
}
