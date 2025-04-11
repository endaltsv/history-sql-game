import React, { useCallback, useEffect, useState } from "react";
import {
  Database,
  Key,
  Link,
  Loader2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Info,
} from "lucide-react";
import ReactFlow, {
  Node,
  Edge,
  Position,
  MarkerType,
  Handle,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";
import { db } from "../../services/DatabaseService";
import { useDatabase } from "../../hooks/useDatabase";
import { api } from "../../services/ApiService";
import { motion, AnimatePresence } from "framer-motion";
import type { TableSchema, SchemaData, Column } from "../../services/ApiService";
import axios from "axios";

interface DatabaseSchemaProps {
  caseId: string;
}

interface TableNodeProps {
  data: TableSchema;
}

// Add copy to clipboard function
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

function TableNode({ data }: TableNodeProps) {
  return (
    <div className="bg-amber-100/50 rounded-lg border border-amber-900/10 min-w-[200px]">
      <div className="bg-amber-100 px-4 py-2 flex items-center">
        <Database className="w-4 h-4 mr-2 text-amber-900" />
        <span className="font-detective text-amber-900">{data.tableName}</span>
      </div>
      <div className="p-2">
        {data.columns.map((column: Column) => (
          <div
            key={column.name}
            className="flex items-center text-sm py-1 relative"
          >
            <span className="text-amber-900">
              {column.name} ({column.type})
              {column.isPrimary && (
                <Key
                  className="w-3 h-3 text-amber-900 inline ml-1"
                  aria-label="Primary Key"
                />
              )}
              {column.isForeign && (
                <Link
                  className="w-3 h-3 text-amber-700 inline ml-1"
                  aria-label="Foreign Key"
                />
              )}
            </span>
            {/* Add handles for primary and foreign keys */}
            {column.isPrimary && (
              <Handle
                type="source"
                position={Position.Right}
                id={`${column.name}-source`}
                style={{ top: "50%", background: "#78350f" }}
              />
            )}
            {column.isForeign && (
              <Handle
                type="target"
                position={Position.Left}
                id={`${column.name}-target`}
                style={{ top: "50%", background: "#78350f" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function calculateNodePosition(
  index: number,
  total: number,
  radius: number = 300
) {
  // For single node, place it in the center
  if (total === 1) {
    return { x: radius, y: radius };
  }

  // Calculate angle for current node (subtract π/2 to start from top)
  const angle = (2 * Math.PI * index) / total - Math.PI / 2;

  // Calculate position using trigonometry
  return {
    x: radius + radius * Math.cos(angle),
    y: radius + radius * Math.sin(angle),
  };
}

export function DatabaseSchemaGraph({ schema }: { schema: TableSchema[] }) {
  const initialNodes = React.useMemo(() => {
    const nodes: Node[] = [];
    const totalTables = schema.length;

    schema.forEach((table, index) => {
      const position = calculateNodePosition(index, totalTables);
      nodes.push({
        id: table.tableName,
        type: "tableNode",
        position,
        data: table,
      });
    });
    return nodes;
  }, [schema]);

  const initialEdges = React.useMemo(() => {
    const edges: Edge[] = [];
    schema.forEach((table) => {
      if (table.foreignKeys) {
        table.foreignKeys.forEach((fk: { fromColumn: string; toTable: string; toColumn: string }) => {
          edges.push({
            id: `${table.tableName}-${fk.fromColumn}-${fk.toTable}`,
            source: fk.toTable,
            target: table.tableName,
            sourceHandle: `${fk.toColumn}-source`,
            targetHandle: `${fk.fromColumn}-target`,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#78350f",
            },
            style: {
              stroke: "#78350f",
              strokeWidth: 2,
              strokeDasharray: "none",
            },
          });
        });
      }
    });
    return edges;
  }, [schema]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => [...eds, params]),
    [setEdges]
  );

  const nodeTypes = React.useMemo(
    () => ({
      tableNode: TableNode,
    }),
    []
  );

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

export default function DatabaseSchema({ caseId }: DatabaseSchemaProps) {
  const [data, setData] = useState<SchemaData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getCaseSchema(caseId);
        setData(response);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('Схема для данного кейса не найдена');
        } else {
          setError('Не удалось загрузить схему таблицы');
        }
        console.error('Ошибка при загрузке схемы:', err);
        setData(null);
      }
    };

    fetchData();
  }, [caseId]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-start gap-3">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Ошибка загрузки</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  const tables = 'tables' in data ? data.tables : [data];

  return (
    <div className="grid gap-6">
      {tables.map((table) => (
        <div key={table.tableName} className="bg-gradient-to-r from-amber-100 to-amber-50 rounded-lg shadow-sm border border-amber-200">
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="w-full flex items-center justify-between px-4 py-3 border-b border-amber-200 hover:bg-amber-100/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-1.5 rounded-lg">
                <Database className="w-4 h-4 text-amber-700 flex-shrink-0" />
              </div>
              <h3 className="font-detective text-base text-amber-900 flex items-center">Схема таблицы {table.tableName}</h3>
            </div>
            <motion.div
              animate={{ rotate: isVisible ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <ChevronDown className="w-4 h-4 text-amber-700" />
            </motion.div>
          </button>
          <AnimatePresence>
            {isVisible && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-3">
                  <div className="grid gap-1.5">
                    {table.columns.map((column: Column) => (
                      <div
                        key={column.name}
                        className="flex items-center justify-between gap-4 px-3 py-1.5 rounded-lg hover:bg-amber-100/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(column.name);
                            }}
                            className="font-mono text-sm text-amber-900 hover:text-amber-700"
                          >
                            {column.name}
                          </button>
                          {column.isPrimary && (
                            <span className="text-[10px] font-medium bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded">
                              PRIMARY
                            </span>
                          )}
                          {column.isNullable && (
                            <span className="text-[10px] font-medium bg-amber-100/50 text-amber-500 px-1.5 py-0.5 rounded">
                              NULL
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-xs text-amber-600">{column.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
