"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { FormField } from "@/types/form";
import FieldRenderer from "@/components/FieldRenderer";

interface Props {
  field: FormField;
  index: number;
  total: number;
  active: boolean;
  meta: { label: string; icon: LucideIcon; tile: string };
  onSelect: () => void;
  onMove: (dir: -1 | 1) => void;
  onDuplicate: () => void;
  onRemove: () => void;
}

export default function SortableFieldCard({
  field,
  index,
  total,
  active,
  meta,
  onSelect,
  onMove,
  onDuplicate,
  onRemove,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = meta.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-2xl border bg-white shadow-sm transition-shadow ${
        isDragging
          ? "z-20 border-blue-400 opacity-90 shadow-2xl ring-2 ring-blue-400/30"
          : active
          ? "border-blue-500 ring-2 ring-blue-500/20"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      {active && !isDragging && (
        <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-blue-500" />
      )}

      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
        <div className="flex items-center gap-2">
          {/* DRAG HANDLE */}
          <button
            type="button"
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            title="Drag to reorder"
            aria-label="Drag to reorder"
            className={`-ml-1 touch-none rounded-md p-1 text-gray-300 hover:bg-gray-100 hover:text-gray-600 ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <span className={`flex h-6 w-6 items-center justify-center rounded-md ${meta.tile}`}>
            <Icon className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-medium text-gray-500">{meta.label}</span>
          {field.required && (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
              Required
            </span>
          )}
        </div>

        <div className="flex items-center gap-0.5">
          <button
            title="Move up"
            disabled={index === 0}
            onClick={(e) => {
              e.stopPropagation();
              onMove(-1);
            }}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            title="Move down"
            disabled={index === total - 1}
            onClick={(e) => {
              e.stopPropagation();
              onMove(1);
            }}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            title="Duplicate"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="rounded-md p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="pointer-events-none p-5">
        <FieldRenderer field={field} value={undefined} onChange={() => {}} />
      </div>
    </div>
  );
}