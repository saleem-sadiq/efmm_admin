"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import MyImage from "../../shared/MyImage";

interface AddButtonConfig {
  name: string;
  link: string;
}

type ViewDataProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  addButton?: AddButtonConfig;
  actionComponent?: React.FC<{
    prop: TData;
    basePath: string;
  }>;
  basePath: string;
};

const ViewData = <TData, TValue>({
  columns,
  data,
  addButton,
  actionComponent: ActionComponent,
  basePath,
}: ViewDataProps<TData, TValue>) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 7,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedRowData, setSelectedRowData] = useState<TData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataState, setData] = useState<TData[]>(data); // Use state to store data
  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    if (
      selectedRowData &&
      typeof (selectedRowData as Record<string, any>)["id"] === "number"
    ) {
      setId((selectedRowData as Record<string, any>)["id"]);
    }
  }, [selectedRowData]);

  const table = useReactTable({
    data: dataState,
    columns,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      pagination,
      columnFilters,
    },
  });

  const handleRowClick = (
    row: TData,
    e: React.MouseEvent<HTMLTableRowElement>
  ) => {
    const target = e.target as HTMLElement;

    // Check if the clicked element is within the action column or delete dialog overlay
    const isActionColumn =
      target.closest("[data-column-id='actions']") !== null;
    const isDeleteDialogOverlay = target.closest("#deleteDialog") !== null;
    const isDeleteDialogCloseButton =
      target.closest("#deleteDialogCloseButton") !== null;
    const isDeleteDialogBody = target.closest("#deleteDialogBody") !== null;

    // If the click is not within the action column, delete dialog overlay, or close button, open the row dialog
    if (
      !isActionColumn &&
      !isDeleteDialogOverlay &&
      !isDeleteDialogCloseButton &&
      !isDeleteDialogBody
    ) {
      setSelectedRowData(row);
      setDialogOpen(true);
    }
  };

  const updateStatus = async (
    id: number,
    newStatus: "pending" | "completed"
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/appointments/update_status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status: newStatus,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        toast.success("Status updated successfully!");

        // Update the status of the item in the data
        const updatedData = data.map((item) => {
          const itemWithId = item as Record<string, any>;
          return itemWithId.id === id ? { ...item, status: newStatus } : item;
        });

        // Set the updated data
        setData(updatedData);
        window.location.reload();
      } else {
        toast.error(result.message || "Failed to update status.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the status.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-blackfade2"
        />
        {addButton && (
          <Link href={addButton.link}>
            <Button className="bg-blackfade2">{addButton.name}</Button>
          </Link>
        )}
      </div>
      <div className="rounded-md border">
        <Table className="bg-blackfade2 rounded-md">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={(e) => handleRowClick(row.original, e)}
                  className="cursor-pointer"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} data-column-id={cell.column.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="bg-blackfade2"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="bg-blackfade2"
        >
          Next
        </Button>
      </div>

      {/* Dialog for showing row details */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(isOpen) => {
          if (!isDeleteDialogOpen) setDialogOpen(isOpen);
        }}
      >
        <DialogContent className="bg-blackfade2 text-white max-w-[40rem] w-full break-words h-[40rem] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Row Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-w-[36rem]">
            {selectedRowData && (
              <>
                {Object.entries(selectedRowData).map(([key, value]) => (
                  <div key={key} className="!break-words">
                    <strong>{key}:</strong>{" "}
                    {key === "image_url" ? (
                      <MyImage
                        src={String(value)}
                        alt="Image"
                        width={1000}
                        height={1000}
                        className="mt-2 rounded w-40 h-40 object-contain"
                        priority
                      />
                    ) : key === "file_url" ? (
                      <Link href={String(value)} target="blank">
                        {String(value)}
                      </Link>
                    ) : key == "status" ? (
                      value == 0 ||
                      (1 && (
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium ${
                            value == 1
                              ? "text-green-700 bg-green-100"
                              : "text-red-700 bg-red-100"
                          }`}
                        >
                          {value == 1 ? "Active" : "Disabled"}
                        </span>
                      ))
                    ) : (
                      String(value)
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
          <DialogFooter>
            {selectedRowData &&
              ActionComponent &&
              React.createElement(ActionComponent, {
                prop: selectedRowData,
                basePath: basePath,
              })}
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewData;
