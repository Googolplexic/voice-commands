// assistant.js
const { create } = require('lodash');
const { sendMessage } = require('./websocket');

const tools = [
    {
        "type": "function",
        "function": {
            "name": "create_rectangle",
            "description": "Draws a rectangle of a given size and color on the screen. It takes the width and height of the rectangle in pixels, the x and y coordinates for the centre of the rectangle, a rotation amount, and an RGBA color value. The rotation amount is in degrees and rotates the rectangle around its center. 0 should be the default rotation amount.",
            "parameters": {
                "type": "object",
                "properties": {
                    "width": {
                        "type": "integer",
                        "description": "Width of the rectangle in pixels."
                    },
                    "height": {
                        "type": "integer",
                        "description": "Height of the rectangle in pixels."
                    },
                    "xLocation": {
                        "type": "integer",
                        "description": "X coordinate of the centre of the rectangle on the canvas grid (0,0 is the top left)."
                    },
                    "yLocation": {
                        "type": "integer",
                        "description": "Y coordinate of the centre of the rectangle on the canvas grid (0,0 is the top left)."
                    },
                    "angle": {
                        "type": "number",
                        "description": "Angle in degrees to rotate the rectangle."
                    },
                    "color": {
                        "type": "object",
                        "properties": {
                            "red": {
                                "type": "number",
                                "description": "Red component of the color (0 to 1)."
                            },
                            "green": {
                                "type": "number",
                                "description": "Green component of the color (0 to 1)."
                            },
                            "blue": {
                                "type": "number",
                                "description": "Blue component of the color (0 to 1)."
                            },
                            "alpha": {
                                "type": "number",
                                "description": "Alpha component of the color (0 for transparent to 1 for opaque)."
                            }
                        },
                        "required": ["red", "green", "blue", "alpha"],
                        "additionalProperties": false
                    }
                },
                "required": ["width", "height", "xLocation", "yLocation", "angle", "color"],
                "additionalProperties": false
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "create_line",
            "description": "Creates a line from a starting point to an ending point with a specified stroke width and color",
            "parameters": {
                "type": "object",
                "properties": {
                    "xStart": {
                        "type": "number",
                        "description": "The x-coordinate of the starting point"
                    },
                    "yStart": {
                        "type": "number",
                        "description": "The y-coordinate of the starting point"
                    },
                    "xEnd": {
                        "type": "number",
                        "description": "The x-coordinate of the ending point"
                    },
                    "yEnd": {
                        "type": "number",
                        "description": "The y-coordinate of the ending point"
                    },
                    "width": {
                        "type": "number",
                        "description": "The stroke width of the line"
                    },
                    "color": {
                        "type": "object",
                        "properties": {
                            "red": {
                                "type": "number",
                                "description": "Red component of the color (0 to 1)."
                            },
                            "green": {
                                "type": "number",
                                "description": "Green component of the color (0 to 1)."
                            },
                            "blue": {
                                "type": "number",
                                "description": "Blue component of the color (0 to 1)."
                            },
                            "alpha": {
                                "type": "number",
                                "description": "Alpha component of the color (0 for transparent to 1 for opaque)."
                            }
                        },
                        "required": ["red", "green", "blue", "alpha"],
                        "additionalProperties": false
                    }
                },
                "required": ["xStart", "yStart", "xEnd", "yEnd", "width", "color"]
            }
        }
    },


    {
        "type": "function",
        "function": {
            "name": "create_ellipse",
            "description": "Draws a ELLIPSE or circle of a given size and color on the screen. It takes the width and height \
            of the ellipse in pixels, the x and y coordinates of the center, a rotation angle, and an RGBA color value. If \
            only one size value is given, then assume circle and have same width and height. The rotation amount is in degrees \
            and rotates the ellipse around its center. 0 should be the default rotation amount.",
            "parameters": {
                "type": "object",
                "properties": {
                    "width": {
                        "type": "integer",
                        "description": "Width of the ellipse in pixels."
                    },
                    "height": {
                        "type": "integer",
                        "description": "Height of the ellipse in pixels."
                    },
                    "xLocation": {
                        "type": "integer",
                        "description": "X coordinate of the center the ellipse on the canvas grid (0,0 is the top left)."
                    },
                    "yLocation": {
                        "type": "integer",
                        "description": "Y coordinate of the center of the ellipse on the canvas grid (0,0 is the top left)."
                    },
                    "angle": {
                        "type": "number",
                        "description": "Angle in degrees to rotate the rectangle."
                    },
                    "color": {
                        "type": "object",
                        "properties": {
                            "red": {
                                "type": "number",
                                "description": "Red component of the color (0 to 1)."
                            },
                            "green": {
                                "type": "number",
                                "description": "Green component of the color (0 to 1)."
                            },
                            "blue": {
                                "type": "number",
                                "description": "Blue component of the color (0 to 1)."
                            },
                            "alpha": {
                                "type": "number",
                                "description": "Alpha component of the color (0 for transparent to 1 for opaque)."
                            }
                        },
                        "required": ["red", "green", "blue", "alpha"],
                        "additionalProperties": false
                    }
                },
                "required": ["width", "height", "xLocation", "yLocation", "angle", "color"],
                "additionalProperties": false
            }
        }
    },


    {
        "type": "function",
        "function": {
            "name": "create_text",
            "description": "Creates a text element on the page at a certain location. The angle parameter will rotate the text and should default to 0 if not provided in prompt.",
            "parameters": {
                "type": "object",
                "properties": {
                    "text": {
                        "type": "string",
                        "description": "content of the text element to be displayed"
                    },
                    "xLocation": {
                        "type": "integer",
                        "description": "X coordinate of the top left of the text (0,0 is the top left of the canvas grid)."
                    },
                    "yLocation": {
                        "type": "integer",
                        "description": "Y coordinate of the top left of the text (0,0 is the top left of the canvas grid)."
                    },
                    "angle": {
                        "type": "number",
                        "description": "Angle in degrees to rotate the text."
                    }
                },
                "required": ["text", "xLocation", "yLocation", "angle"],
                "additionalProperties": false
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_page",
            "description": "Do not call this function unless explicity told to create a new page.Creates a new page or canvas with specified width, height, and an  background color. If no background color is provided, create the page with default as white.",
            "parameters": {
                "type": "object",
                "properties": {
                    "width": {
                        "type": "integer",
                        "description": "Width of the new page in pixels."
                    },
                    "height": {
                        "type": "integer",
                        "description": "Height of the new page in pixels."
                    },
                    "color": {
                        "type": "object",
                        "description": "Optional background color for the new page in RGBA format.",
                        "properties": {
                            "red": {
                                "type": "number",
                                "description": "Red component of the color (0 to 1)."
                            },
                            "green": {
                                "type": "number",
                                "description": "Green component of the color (0 to 1)."
                            },
                            "blue": {
                                "type": "number",
                                "description": "Blue component of the color (0 to 1)."
                            },
                            "alpha": {
                                "type": "number",
                                "description": "Alpha component of the color (0 for transparent to 1 for opaque)."
                            }
                        },
                        "required": ["red", "green", "blue", "alpha"],
                        "additionalProperties": false
                    }
                },
                "required": ["width", "height", "color"],
                "additionalProperties": false
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "delete_selected",
            "description": "Deletes all items in the selection",
            "parameters": {
                "type": "object",
                "properties": {
                },
                "required": [],
                "additionalProperties": false
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "move_by_selected",
            "description": "Moves all selected items by a specified amount in pixels in the x and y directions. 0,0 is the top left corner of the canvas and both x and y increase as you move down and to the right.",
            "parameters": {
                "type": "object",
                "properties": {
                    "deltaX": {
                        "type": "integer",
                        "description": "Change to the x-coordinate of the selected objects in pixels.",
                    },
                    "deltaY": {
                        "type": "integer",
                        "description": "Change to the y-coordinate of the selected objects in pixels.",
                    }
                },
                "required": ["deltaX", "deltaY"],
                "additionalProperties": false,
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "move_to_selected",
            "description": "Moves all selected items to the specified x and y coordinates. 0,0 is the top left corner of the canvas and both x and y increase as you move down and to the right.",
            "parameters": {
                "type": "object",
                "properties": {
                    "targetX": {
                        "type": "integer",
                        "description": "Move to the x-coordinate of the selected objects in pixels.",
                    },
                    "targetY": {
                        "type": "integer",
                        "description": "Move to the y-coordinate of the selected objects in pixels.",
                    }
                },
                "required": ["targetX", "targetY"],
                "additionalProperties": false,
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "rotate_selected",
            "description": "Rotates all selected items by a specified angle in degrees around the centre.",
            "parameters": {
                "type": "object",
                "properties": {
                    "angle": {
                        "type": "number",
                        "description": "Angle in degrees to rotate the selected objects.",
                    }
                },
                "required": ["angle"],
                "additionalProperties": false,
            }
        },
    },
    {
        "type": "function",
        "function": {
            "name": "set_selected_fill_color",
            "description": "Sets the fill color of selected fillable objects in the editor.",
            "parameters": {
                "type": "object",
                "properties": {
                    "red": {
                        "type": "number",
                        "description": "The red component of the color (0-1)",
                        "minimum": 0,
                        "maximum": 1
                    },
                    "green": {
                        "type": "number",
                        "description": "The green component of the color (0-1)",
                        "minimum": 0,
                        "maximum": 1
                    },
                    "blue": {
                        "type": "number",
                        "description": "The blue component of the color (0-1)",
                        "minimum": 0,
                        "maximum": 1
                    },
                    "alpha": {
                        "type": "number",
                        "description": "The alpha (opacity) component of the color (0-1)",
                        "minimum": 0,
                        "maximum": 1
                    }
                },
                "required": ["red", "green", "blue", "alpha"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "set_selection_text_content",
            "description": "Sets the content of selected text objects in the editor.",
            "parameters": {
                "type": "object",
                "properties": {
                    "content": {
                        "type": "string",
                        "description": "The new text content to set for the text objects"
                    }
                },
                "required": ["content"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_triangle",
            "description": "Draws a triangle given 3 coordinates and a color on the screen. The coordinates are the x and y coordinates of the 3 vertices of the triangle. The color is an RGBA color value.",
            "parameters": {
                "type": "object",
                "properties": {
                    "x1": {
                        "type": "integer",
                        "description": "X coordinate of the first vertex of the triangle.(0,0 is the top left)"
                    },
                    "y1": {
                        "type": "integer",
                        "description": "Y coordinate of the first vertex of the triangle.(0,0 is the top left)"
                    },
                    "x2": {
                        "type": "integer",
                        "description": "X coordinate of the second vertex of the triangle.(0,0 is the top left)"
                    },
                    "y2": {
                        "type": "integer",
                        "description": "Y coordinate of the second vertex of the triangle.(0,0 is the top left)"
                    },
                    "x3": {
                        "type": "integer",
                        "description": "X coordinate of the third vertex of the triangle.(0,0 is the top left)"
                    },
                    "y3": {
                        "type": "integer",
                        "description": "Y coordinate of the third vertex of the triangle.(0,0 is the top left)"
                    },
                    "color": {
                        "type": "object",
                        "properties": {
                            "red": {
                                "type": "number",
                                "description": "Red component of the color (0 to 1)."
                            },
                            "green": {
                                "type": "number",
                                "description": "Green component of the color (0 to 1)."
                            },
                            "blue": {
                                "type": "number",
                                "description": "Blue component of the color (0 to 1)."
                            },
                            "alpha": {
                                "type": "number",
                                "description": "Alpha component of the color (0 for transparent to 1 for opaque)."
                            }
                        },
                        "required": ["red", "green", "blue", "alpha"],
                        "additionalProperties": false
                    }
                },
                "required": ["x1", "y1", "x2", "y2", "x3", "y3", "color"],
                "additionalProperties": false
            }
        }
    }
];

function create_rectangle(width, height, xLocation, yLocation, angle, color) {
    const command = 'createRectangle';
    const params = { width, height, xLocation, yLocation, angle, color };
    sendMessage(command, params);
    return `Created a rectangle with dimensions ${width}x${height} at position (${xLocation}, ${yLocation}) with color RGBA(${color.red}, ${color.green}, ${color.blue}, ${color.alpha}) and rotated by ${angle} degrees`;
}


function create_ellipse(width, height, xLocation, yLocation, angle, color) {
    const command = 'createEllipse';
    const params = { width, height, xLocation, yLocation, angle, color };
    sendMessage(command, params);
    return `Created a ellipse with  dimensions ${width}x${height} at position (${xLocation}, ${yLocation}) with color RGBA(${color.red}, ${color.green}, ${color.blue}, ${color.alpha}) and rotated by ${angle} degrees`;
}

function create_text(text, xLocation, yLocation, angle) {
    const command = 'createText';
    const params = { text, xLocation, yLocation, angle };
    sendMessage(command, params);
    return `Created text with content "${text}" at position (${xLocation}, ${yLocation}) and rotated by ${angle} degrees`;
}

function create_line(xStart, yStart, xEnd, yEnd, width, color) {
    const command = 'createLine';
    const params = { xStart, yStart, xEnd, yEnd, width, color };
    sendMessage(command, params);
    return `Created a line from (${xStart}, ${yStart}) to (${xEnd}, ${yEnd}) with a stroke width of ${width} and color RGBA(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
}

function create_page(width, height, color) {
    const command = 'addNewPage';
    const params = { width, height, color };
    sendMessage(command, params);
    return `Created a new page with dimensions ${width}x${height} and background color RGBA(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
}

function delete_selected() {
    const command = 'deleteSelectedObjects';
    const params = {};
    sendMessage(command, params);
    return `Deleted all items in the selection`;
}

function move_by_selected(deltaX, deltaY) {
    const command = 'moveBySelectedObjects';
    const params = { deltaX, deltaY };
    sendMessage(command, params);
    return `Moved all selected items by ${deltaX} pixels in the x-direction and ${deltaY} pixels in the y-direction`;
}

function move_to_selected(targetX, targetY) {
    const command = 'moveToSelectedObjects';
    const params = { targetX, targetY };
    sendMessage(command, params);
    return `Moved all selected items to the position (${targetX}, ${targetY})`;
}

function rotate_selected(angle) {
    const command = 'rotateSelectedObjects';
    const params = { angle };
    sendMessage(command, params);
    return `Rotated all selected items by ${angle} degrees around the centre`;
}
function set_selected_fill_color(red, green, blue, alpha) {
    const command = 'setSelectedFillColor';
    const params = { red, green, blue, alpha };
    sendMessage(command, params);
    return `Set all selected items' fill color to RGBA(${red}, ${green}, ${blue}, ${alpha})`;
}
function set_selection_text_content(content) {
    const command = 'setSelectionTextContent';
    const params = { content };
    sendMessage(command, params);
    return `Set the content of selected text objects to "${content}"`;
}
function create_triangle(x1, y1, x2, y2, x3, y3, color) {
    const command = 'createTriangle';
    const params = { x1, y1, x2, y2, x3, y3, color };
    sendMessage(command, params);
    return `Created a triangle with vertices (${x1}, ${y1}), (${x2}, ${y2}), and (${x3}, ${y3}) with color RGBA(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
}
module.exports = { tools, create_rectangle, create_line, create_ellipse, create_text, create_page, delete_selected, move_by_selected, move_to_selected, rotate_selected, set_selected_fill_color, set_selection_text_content, create_triangle };
