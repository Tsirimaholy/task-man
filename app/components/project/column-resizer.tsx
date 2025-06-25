import { type Header, type Table } from "@tanstack/react-table";
import type { Project } from "generated/prisma/client";

export const ColumnResizer = ({
  header,
}: {
  header: Header<any, any>;
}) => {
  if (header.column.getCanResize() === false) return <></>;

  return (
    <div
      {...{
        onMouseDown: header.getResizeHandler(),
        onTouchStart: header.getResizeHandler(),
        className: `absolute top-0 right-0 cursor-col-resize h-full border hover:bg-gray-700 hover:w-1 w-px transition`,
      }}
    />
  );
};
