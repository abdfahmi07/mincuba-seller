type OverlayProps = {
  handleShowSidebar: (value: boolean) => void;
};

export default function Overlay({ handleShowSidebar }: OverlayProps) {
  return (
    <div
      className="bg-black/20 fixed top-0 bottom-0 left-0 right-0 z-15 backdrop-blur-[2px]"
      onClick={() => handleShowSidebar(false)}
    ></div>
  );
}
