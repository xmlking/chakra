import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
} from "@workspace/ui/components/reui/cascader/cascader";
import {
  CascaderAction,
  CascaderFooter,
  CascaderSubmenu,
  CascaderSubmenuContent,
  CascaderSubmenuTrigger,
  useCascaderSubmenu,
} from "@workspace/ui/components/reui/cascader/cascader-footer";
import {
  CascaderGroup,
  CascaderItems,
  CascaderLabel,
  CascaderSeparator,
} from "@workspace/ui/components/reui/cascader/cascader-item";
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
} from "@workspace/ui/components/reui/cascader/cascader-nav";
import type { CascaderNode } from "@workspace/ui/components/reui/cascader/cascader-types";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Columns3Icon, PlusIcon } from "lucide-react";
import { Fragment, useMemo } from "react";

import {
  ATTRIBUTE_TYPE_ICONS,
  ATTRIBUTE_TYPE_LABELS,
  COMPANY_ATTRIBUTE_TREE,
  customGroupIcon,
  LOCKED_ATTRIBUTE_IDS,
  NEW_ATTRIBUTE_GROUPS,
  type AttributeType,
  type CompanyAttribute,
} from "../data";

/**
 * Its own component: `useCascaderSubmenu` must be called from INSIDE the
 * submenu, and `close()` is what makes a command run and dismiss the list.
 */
function NewAttributeMenu({ onCreate }: { onCreate: (type: AttributeType) => void }) {
  const { close } = useCascaderSubmenu();

  const run = (type: AttributeType) => () => {
    onCreate(type);
    close();
  };

  return (
    <>
      {NEW_ATTRIBUTE_GROUPS.map((group, index) => (
        <Fragment key={group.label}>
          {index > 0 ? <CascaderSeparator /> : null}
          <CascaderGroup className="gap-0.5">
            <CascaderLabel>{group.label}</CascaderLabel>
            {group.types.map((type) => (
              <CascaderAction key={type} icon={ATTRIBUTE_TYPE_ICONS[type]} onSelect={run(type)}>
                {ATTRIBUTE_TYPE_LABELS[type]}
              </CascaderAction>
            ))}
          </CascaderGroup>
        </Fragment>
      ))}
    </>
  );
}

/**
 * Marks locked attributes disabled so they read as permanently added rather
 * than as rows that silently do nothing when pressed.
 */
function markLocked(nodes: CascaderNode[]): CascaderNode[] {
  return nodes.map((node) => ({
    ...node,
    disabled: LOCKED_ATTRIBUTE_IDS.includes(node.value),
    children: node.children ? markLocked(node.children) : undefined,
  }));
}

const ATTRIBUTE_TREE = markLocked(COMPANY_ATTRIBUTE_TREE);

interface AddColumnCascaderProps {
  /** Every attribute currently in the grid, locked ones included. */
  value: string[];
  /** Attributes made from the footer, listed so they can be removed again. */
  createdAttributes: CompanyAttribute[];
  onValueChange: (value: string[]) => void;
  onCreateAttribute: (type: AttributeType) => void;
}

export function AddColumnCascader({
  value,
  createdAttributes,
  onValueChange,
  onCreateAttribute,
}: AddColumnCascaderProps) {
  // Created attributes join the tree so unchecking one removes its column,
  // which keeps create and remove symmetric.
  const items = useMemo(() => {
    if (createdAttributes.length === 0) return ATTRIBUTE_TREE;
    return [
      ...ATTRIBUTE_TREE,
      {
        value: "custom",
        label: "Custom",
        icon: customGroupIcon,
        children: createdAttributes.map((attribute) => ({
          value: attribute.id,
          label: attribute.label,
          icon: ATTRIBUTE_TYPE_ICONS[attribute.type],
        })),
      },
    ];
  }, [createdAttributes]);

  return (
    <Cascader
      multiple
      items={items}
      value={value}
      // Deep, not the default per-level scan: typing "phone" must reach a leaf
      // three groups down without drilling there first.
      searchScope="deep"
      // Always open on the group list: revealing the level of an already-added
      // attribute hides the other seven groups behind a back press.
      revealSelected={false}
      onValueChange={(next) => onValueChange(next)}
    >
      {/* A toolbar control beside Filter and Settings, so it keeps its place
          however wide the grid grows. */}
      <CascaderTrigger
        aria-label="Columns"
        showIcon={false}
        render={<Button type="button" variant="outline" />}
      >
        <Columns3Icon className="size-4" aria-hidden="true" />
        Columns
      </CascaderTrigger>

      <CascaderContent align="end" className="w-64">
        <CascaderPanel>
          <CascaderNav>
            <CascaderInput placeholder="Search attributes" />
          </CascaderNav>
          <CascaderBreadcrumb />
          <CascaderEmpty />
          <CascaderList>
            <CascaderItems />
          </CascaderList>

          {/* A SIBLING of the list, never a child: anything rendered inside the
              list would be clicked by the list's own Enter handler. */}
          <CascaderFooter>
            <CascaderSubmenu>
              <CascaderSubmenuTrigger icon={<PlusIcon className="size-4" aria-hidden="true" />}>
                Create new attribute
              </CascaderSubmenuTrigger>
              {/* Six of eight styles overflow the flyout's max-h-72 cap. Scroll
                  ONE axis: `overflow-y-auto` alone also promotes overflow-x. */}
              <CascaderSubmenuContent className="overflow-x-hidden overflow-y-auto">
                <NewAttributeMenu onCreate={onCreateAttribute} />
              </CascaderSubmenuContent>
            </CascaderSubmenu>
          </CascaderFooter>

          <CascaderStatus />
        </CascaderPanel>
      </CascaderContent>
    </Cascader>
  );
}
