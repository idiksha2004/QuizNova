<?php
/**
 * REST API Routes for QuizNova
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

/**
 * Register all custom API routes for QuizNova.
 */
function quiznova_register_api_routes() {
    $namespace = 'quiznova/v1';

    // Route to get all quizzes
    register_rest_route( $namespace, '/quizzes', [
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => 'quiznova_get_quizzes',
        'permission_callback' => 'quiznova_api_permission_check',
    ] );

    // Route to create a new quiz
    register_rest_route( $namespace, '/quizzes', [
        'methods'             => WP_REST_Server::CREATABLE,
        'callback'            => 'quiznova_create_quiz',
        'permission_callback' => 'quiznova_api_permission_check',
    ] );

    // Route to update a quiz
    register_rest_route( $namespace, '/quizzes/(?P<id>\d+)', [
        'methods'             => WP_REST_Server::EDITABLE,
        'callback'            => 'quiznova_update_quiz',
        'permission_callback' => 'quiznova_api_permission_check',
    ] );

    // Route to delete a quiz
    register_rest_route( $namespace, '/quizzes/(?P<id>\d+)', [
        'methods'             => WP_REST_Server::DELETABLE,
        'callback'            => 'quiznova_delete_quiz',
        'permission_callback' => 'quiznova_api_permission_check',
    ] );
}
add_action( 'rest_api_init', 'quiznova_register_api_routes' );

/**
 * Permission check for all API routes.
 * Only allows users who can manage options (administrators).
 *
 * @return bool
 */
function quiznova_api_permission_check() {
    return current_user_can( 'manage_options' );
}

/**
 * Callback to get all quizzes.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function quiznova_get_quizzes( WP_REST_Request $request ) {
    global $wpdb;
    $quizzes_table = $wpdb->prefix . 'quiznova_quizzes';
    $questions_table = $wpdb->prefix . 'quiznova_questions';

    // A more efficient query to get quizzes and their question counts
    $query = "
        SELECT q.*, COUNT(qq.id) as questions
        FROM $quizzes_table q
        LEFT JOIN $questions_table qq ON q.id = qq.quiz_id
        GROUP BY q.id
        ORDER BY q.created_at DESC
    ";

    $quizzes = $wpdb->get_results( $query );

    // Mock 'plays' for now as we don't have a tracking table yet.
    foreach($quizzes as $quiz) {
        $quiz->plays = rand(50, 300); // Placeholder
        $quiz->date = date('Y-m-d', strtotime($quiz->created_at));
    }

    return new WP_REST_Response( $quizzes, 200 );
}

/**
 * Callback to create a new quiz.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function quiznova_create_quiz( WP_REST_Request $request ) {
    global $wpdb;
    $params = $request->get_json_params();
    $quizzes_table = $wpdb->prefix . 'quiznova_quizzes';
    $questions_table = $wpdb->prefix . 'quiznova_questions';

    // Insert quiz details
    $wpdb->insert(
        $quizzes_table,
        [
            'title'       => sanitize_text_field( $params['title'] ),
            'description' => sanitize_textarea_field( $params['description'] ),
            'status'      => sanitize_text_field( $params['status'] ),
            'author_id'   => get_current_user_id(),
            'created_at'  => current_time( 'mysql' ),
        ],
        [ '%s', '%s', '%s', '%d', '%s' ]
    );

    $quiz_id = $wpdb->insert_id;

    // Insert questions
    if ( $quiz_id && ! empty( $params['questionsData'] ) ) {
        foreach ( $params['questionsData'] as $question ) {
            $wpdb->insert(
                $questions_table,
                [
                    'quiz_id'        => $quiz_id,
                    'question_text'  => sanitize_textarea_field( $question['text'] ),
                    'question_type'  => 'multiple-choice',
                    'options'        => wp_json_encode( $question['options'] ),
                    'correct_answer' => sanitize_text_field( $question['correct'] ),
                ],
                [ '%d', '%s', '%s', '%s', '%s' ]
            );
        }
    }

    // Fetch the newly created quiz to return it
    $new_quiz = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $quizzes_table WHERE id = %d", $quiz_id ) );

    return new WP_REST_Response( $new_quiz, 201 );
}

/**
 * Callback to update an existing quiz.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function quiznova_update_quiz( WP_REST_Request $request ) {
    global $wpdb;
    $params = $request->get_json_params();
    $quiz_id = (int) $request['id'];
    
    $quizzes_table = $wpdb->prefix . 'quiznova_quizzes';
    $questions_table = $wpdb->prefix . 'quiznova_questions';

    // Update quiz details
    $wpdb->update(
        $quizzes_table,
        [
            'title'       => sanitize_text_field( $params['title'] ),
            'description' => sanitize_textarea_field( $params['description'] ),
            'status'      => sanitize_text_field( $params['status'] ),
        ],
        [ 'id' => $quiz_id ],
        [ '%s', '%s', '%s' ],
        [ '%d' ]
    );

    // Delete old questions
    $wpdb->delete( $questions_table, [ 'quiz_id' => $quiz_id ], [ '%d' ] );

    // Insert updated questions
    if ( ! empty( $params['questionsData'] ) ) {
        foreach ( $params['questionsData'] as $question ) {
            $wpdb->insert(
                $questions_table,
                [
                    'quiz_id'        => $quiz_id,
                    'question_text'  => sanitize_textarea_field( $question['text'] ),
                    'options'        => wp_json_encode( $question['options'] ),
                    'correct_answer' => sanitize_text_field( $question['correct'] ),
                ],
                [ '%d', '%s', '%s', '%s' ]
            );
        }
    }

    return new WP_REST_Response( [ 'success' => true, 'id' => $quiz_id ], 200 );
}

/**
 * Callback to delete a quiz.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function quiznova_delete_quiz( WP_REST_Request $request ) {
    global $wpdb;
    $quiz_id = (int) $request['id'];
    
    $quizzes_table = $wpdb->prefix . 'quiznova_quizzes';
    $questions_table = $wpdb->prefix . 'quiznova_questions';

    // Delete quiz
    $wpdb->delete( $quizzes_table, [ 'id' => $quiz_id ], [ '%d' ] );
    // Delete associated questions
    $wpdb->delete( $questions_table, [ 'quiz_id' => $quiz_id ], [ '%d' ] );

    return new WP_REST_Response( [ 'success' => true, 'id' => $quiz_id ], 200 );
}
