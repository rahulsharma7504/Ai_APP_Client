import React, { useState } from "react";

const DeleteBot = ({ id, bot, onDelete }) => {

    return (

        <div className="modal fade" id={id} tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Delete Chat Bot</h5>
                        <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">

                        {bot ? (
                            <p>Are you sure you want to delete <strong>{bot.name}</strong>?</p>
                        ):(
                            <p>Loading...</p>
                        )}

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={onDelete}>Delete</button>
                    </div>

                </div>
            </div>
        </div>

    );

};

export default DeleteBot;