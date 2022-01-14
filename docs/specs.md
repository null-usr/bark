# Functionality

* User drags and drops a node onto the palette, or presses a hotkey (ie ctrl+A) to add the currently selected node. 
User connects nodes by dragging and dropping the edges together.
Dragging an edge into an empty space should automatically create a node that's then automatically connected, probably of the same type or automatically.

* The user can edit what fields are available on their custom node types and create new node types based on an existing node's fields. Not inheriting but just with the same fields to be expanded upon

* User can drag + select multiple nodes to move them around

* Holding ctrl + clicking an edge should delete it, or right clicking.

* Users can import and export dialogue trees (scenes?)


Things like grouping can be thought about later
Another great feature would be the ability to drag a node or node group onto an edge and have it be inserted into that space. This will only work for the "text" attribute so we can just follow the link down to the end.

# Node Types

We can offer several prebuilt node types

* Root Node (Utility node)
  * Mandatory node, the entry point into that scene's dialogue
* Basic Dialogue Node
  * For basic dialogue. Field for dialogue and field for next node. One entry one exit
* Choice Node(?)
  * One entry, multiple exits

# File Format

Save files as JSON, should be fairly easy for multiple game engines and languages to work with.