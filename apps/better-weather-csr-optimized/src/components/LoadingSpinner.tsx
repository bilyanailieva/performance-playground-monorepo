import { rootStoreContext } from "@/app/layout";
import { observer } from "mobx-react-lite";
import { ProgressSpinner } from "primereact/progressspinner";
import { useContext } from "react";

export const LoadingSpinner = observer(() => {
  const rootStore = useContext(rootStoreContext);
  const display = rootStore.isLoadingOverlayVisible ? "block" : "none";

  return (
    <div
      style={{ display: display }}
      className="absolute w-full h-full top-0 left-0 bg-white bg-opacity-70"
    >
      <ProgressSpinner className="w-16 h-16 absolute top-0 left-0 right-0 bottom-0 m-auto" />
    </div>
  );
});
