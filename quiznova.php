<?php
/**
 * Plugin Name:       QuizNova - WordPress Quiz & Exam Platform
 * Plugin URI:        https://example.com/
 * Description:       A modern, lightweight WordPress plugin that enables site administrators to create and manage quizzes and exams.
 * Version:           1.0.0
 * Author:            Your Name
 */

// 🛑 Move this block to the top to define constants early
if ( ! defined( 'WPINC' ) ) {
    die;
}

define( 'QUIZNOVA_VERSION', '1.0.0' );
define( 'QUIZNOVA_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'QUIZNOVA_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// ✅ Now safely include files that use those constants
require_once QUIZNOVA_PLUGIN_DIR . 'includes/quiznova-init.php';
require_once QUIZNOVA_PLUGIN_DIR . 'includes/api-routes.php';

register_activation_hook( __FILE__, 'quiznova_create_tables' );

/**
 * Admin Menu and UI Rendering
 */
function quiznova_admin_menu() {
    add_menu_page(
        __( 'QuizNova Dashboard', 'quiznova' ),
        __( 'QuizNova', 'quiznova' ),
        'manage_options',
        'quiznova',
        'quiznova_admin_page_html',
        'dashicons-welcome-learn-more',
        25
    );
}
add_action( 'admin_menu', 'quiznova_admin_menu' );

function quiznova_admin_page_html() {
    echo '<div id="quiznova-admin-app"></div>';
}

function quiznova_enqueue_admin_scripts( $hook ) {
    if ( 'toplevel_page_quiznova' !== $hook ) return;

    wp_enqueue_style(
        'quiznova-admin-style',
        QUIZNOVA_PLUGIN_URL . 'css/style.css',
        [],
        QUIZNOVA_VERSION
    );

    wp_enqueue_script(
        'quiznova-admin-script',
        QUIZNOVA_PLUGIN_URL . 'js/script.js',
        [ 'wp-element', 'wp-components', 'wp-i18n' ],
        QUIZNOVA_VERSION,
        true
    );

    wp_localize_script(
        'quiznova-admin-script',
        'quiznovaData',
        [
            'apiUrl' => esc_url_raw( rest_url( 'quiznova/v1/' ) ),
            'nonce'  => wp_create_nonce( 'wp_rest' ),
        ]
    );
}
add_action( 'admin_enqueue_scripts', 'quiznova_enqueue_admin_scripts' );
