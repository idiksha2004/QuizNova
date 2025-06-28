<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

/**
 * Create custom database tables on plugin activation.
 */
function quiznova_create_tables() {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';

    // Table for Quizzes
    $table_quizzes = $wpdb->prefix . 'quiznova_quizzes';
    $sql_quizzes = "CREATE TABLE $table_quizzes (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        title varchar(255) NOT NULL,
        description text,
        status varchar(20) DEFAULT 'draft' NOT NULL,
        author_id bigint(20) unsigned NOT NULL,
        created_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";
    dbDelta( $sql_quizzes );

    // Table for Questions
    $table_questions = $wpdb->prefix . 'quiznova_questions';
    $sql_questions = "CREATE TABLE $table_questions (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        quiz_id mediumint(9) NOT NULL,
        question_text text NOT NULL,
        question_type varchar(50) DEFAULT 'multiple-choice' NOT NULL,
        options longtext, -- Storing options as JSON
        correct_answer varchar(255),
        PRIMARY KEY  (id),
        KEY quiz_id (quiz_id)
    ) $charset_collate;";
    dbDelta( $sql_questions );
}
