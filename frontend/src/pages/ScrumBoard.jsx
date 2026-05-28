import { useState } from "react";

import {
    DragDropContext,
    Droppable,
    Draggable
} from "@hello-pangea/dnd";

import Layout from "../components/Layout";

function ScrumBoard() {

    const [columns, setColumns] = useState({

        todo: [
            {
                id: "1",
                text: "UI Design"
            }
        ],

        progress: [
            {
                id: "2",
                text: "Backend API"
            }
        ],

        done: [
            {
                id: "3",
                text: "Requirement Analysis"
            }
        ]
    });

    const onDragEnd = (result) => {

        if (!result.destination)
            return;

        const sourceColumn =
            result.source.droppableId;

        const destColumn =
            result.destination.droppableId;

        const sourceItems =
            [...columns[sourceColumn]];

        const destItems =
            [...columns[destColumn]];

        const [removed] =
            sourceItems.splice(
                result.source.index,
                1
            );

        destItems.splice(
            result.destination.index,
            0,
            removed
        );

        setColumns({

            ...columns,

            [sourceColumn]:
                sourceItems,

            [destColumn]:
                destItems
        });
    };

    return (

        <Layout>

            <h1 className="page-title">

                Scrum Board

            </h1>

            <DragDropContext
                onDragEnd={onDragEnd}
            >

                <div
                    style={{
                        display: "flex",
                        gap: "20px"
                    }}
                >

                    {Object.entries(columns).map(

                        ([columnId, items]) => (

                            <Droppable
                                droppableId={columnId}
                                key={columnId}
                            >

                                {(provided) => (

                                    <div

                                        ref={
                                            provided.innerRef
                                        }

                                        {...provided.droppableProps}

                                        style={{
                                            background:
                                                "white",

                                            padding:
                                                "15px",

                                            width:
                                                "300px",

                                            minHeight:
                                                "500px",

                                            borderRadius:
                                                "10px"
                                        }}
                                    >

                                        <h2>

                                            {columnId.toUpperCase()}

                                        </h2>

                                        {items.map(

                                            (
                                                item,
                                                index
                                            ) => (

                                                <Draggable

                                                    key={item.id}

                                                    draggableId={
                                                        item.id
                                                    }

                                                    index={index}
                                                >

                                                    {(provided) => (

                                                        <div

                                                            ref={
                                                                provided.innerRef
                                                            }

                                                            {...provided.draggableProps}

                                                            {...provided.dragHandleProps}

                                                            style={{
                                                                padding:
                                                                    "15px",

                                                                marginBottom:
                                                                    "10px",

                                                                background:
                                                                    "#2563eb",

                                                                color:
                                                                    "white",

                                                                borderRadius:
                                                                    "8px",

                                                                ...provided
                                                                    .draggableProps
                                                                    .style
                                                            }}
                                                        >

                                                            {item.text}

                                                        </div>
                                                    )}

                                                </Draggable>
                                            )
                                        )}

                                        {
                                            provided.placeholder
                                        }

                                    </div>
                                )}

                            </Droppable>
                        )
                    )}

                </div>

            </DragDropContext>

        </Layout>
    );
}

export default ScrumBoard;