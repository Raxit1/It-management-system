from app.models.activity_model import (
    ActivityLog
)


def log_activity(

    db,

    current_user,

    action,

    module
):

    new_log = ActivityLog(

        user_email=
            current_user["email"],

        action=action,

        module=module,

        company_id=
            current_user["company_id"]
    )

    db.add(new_log)

    db.commit()