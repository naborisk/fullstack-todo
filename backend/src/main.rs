use axum::{routing::get, Json, Router};
use serde::Serialize;

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct Todo {
    id: u32,
    title: String,
    description: String,
    date_created: String,
    completed: bool,
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/todos", get(todos));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001").await.unwrap();
    println!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

async fn todos() -> Json<Vec<Todo>> {
    let todo1 = Todo {
        id: 1,
        title: "Learn Axum".to_string(),
        description: "Learn how to use Axum".to_string(),
        date_created: "2021-09-01".to_string(),
        completed: false,
    };

    let todo2 = Todo {
        id: 2,
        title: "Learn Rust".to_string(),
        description: "Learn how to use Rust".to_string(),
        date_created: "2021-09-01".to_string(),
        completed: false,
    };

    let todos = vec![todo1.clone(), todo2.clone(), todo2.clone(), todo1];

    Json(todos)
}
