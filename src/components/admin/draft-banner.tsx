export function DraftBanner() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "#f97316",
        color: "#ffffff",
        textAlign: "center",
        padding: "8px 16px",
        fontWeight: 600,
        fontSize: "14px",
      }}
    >
      DRAFT — NOT PUBLISHED — Only visible to admins
    </div>
  );
}
