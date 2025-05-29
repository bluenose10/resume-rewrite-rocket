
import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { SectionConfig } from '@/types/resume';
import { GripVertical, Eye, EyeOff } from 'lucide-react';

interface SortableSectionProps {
  section: SectionConfig;
  onToggleVisibility: (id: string) => void;
}

const SortableSection: React.FC<SortableSectionProps> = ({ section, onToggleVisibility }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <span className="font-medium text-gray-900">{section.title}</span>
        {section.required && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            Required
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {section.visible ? (
          <Eye className="h-4 w-4 text-green-600" />
        ) : (
          <EyeOff className="h-4 w-4 text-gray-400" />
        )}
        <Switch
          checked={section.visible}
          onCheckedChange={() => onToggleVisibility(section.id)}
          disabled={section.required}
        />
      </div>
    </div>
  );
};

interface SectionLayoutManagerProps {
  sections: SectionConfig[];
  onReorder: (newOrder: SectionConfig[]) => void;
  onToggleVisibility: (id: string) => void;
  onResetLayout: () => void;
}

const SectionLayoutManager: React.FC<SectionLayoutManagerProps> = ({
  sections,
  onReorder,
  onToggleVisibility,
  onResetLayout,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = sections.findIndex((section) => section.id === active.id);
      const newIndex = sections.findIndex((section) => section.id === over.id);
      
      const newOrder = arrayMove(sections, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Customize Section Layout</CardTitle>
          <Button variant="outline" size="sm" onClick={onResetLayout}>
            Reset to Default
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Drag sections to reorder them on your resume. Toggle visibility with the switches.
        </p>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {sections.map((section) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  onToggleVisibility={onToggleVisibility}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
};

export default SectionLayoutManager;
