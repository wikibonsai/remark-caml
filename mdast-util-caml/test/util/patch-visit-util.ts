// from: https://github.com/benrbray/remark-cite/blob/master/mdast-util-cite/test/test.ts#L17-L87
// (because there aren't types for unist-util-visit...? https://github.com/syntax-tree/unist-util-visit)
import * as Uni from 'unist';


export type Visitor<V extends Uni.Node = Uni.Node> = (node:V) => VisitorAction | void;

export enum VisitorAction {
  /** Continue traversal as normal. */
  CONTINUE = 1,
  /** Do not traverse this node's children. */
  SKIP     = 2,
  /** Stop traversal immediately. */
  EXIT     = 3
}

export function unistIsParent(node: Uni.Node): node is Uni.Parent {
  return Boolean(Object.keys(node).includes('children'));
}

/**
 * Visit every node in the tree using a depth-first preorder traversal.
 */
export function visit(tree: Uni.Node, visitor: Visitor<Uni.Node>): void {
  recurse(tree);

  function recurse(node: Uni.Node): VisitorAction {
    // visit the node itself and handle the result
    const action = visitor(node) || VisitorAction.CONTINUE;
    if(action === VisitorAction.EXIT) { return VisitorAction.EXIT; }
    if(action === VisitorAction.SKIP) { return VisitorAction.SKIP; }
    if(!unistIsParent(node))          { return action; }

    // visit the node's children from first to last
    for(let childIdx = 0; childIdx < node.children.length; childIdx++) {
      // visit child and handle the subtree result
      const subresult = recurse(node.children[childIdx]);
      if(subresult === VisitorAction.EXIT) { return VisitorAction.EXIT; }

      // TODO: if visitor modified the tree, we might want to allow it
      // to return a new childIdx to continue iterating from
    }

    return action;
  }
}

/**
 * Visit a specific type of node.
 */
export function visitNodeType<S extends string, N extends Uni.Node & { type: S }>(
  tree: Uni.Node,
  type: S,
  visitor: Visitor<N>
): void {
  // filter nodes by type
  function predicate(node: Uni.Node): node is N {
    return (node.type === type);
  }

  // apply the provided visitor only if type predicate matches
  visit(tree, node => {
    if(predicate(node)) { return visitor(node);          }
    else                { return VisitorAction.CONTINUE; }
  });
}
