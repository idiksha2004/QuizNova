<?php
/**
 * Plugin Name:       QuizNova - WordPress Quiz & Exam Platform
 * Plugin URI:        https://example.com/
 * Description:       A modern, lightweight WordPress plugin that enables site administrators to create and manage quizzes and exams.
 * Version:           1.0.0
 * Author:            Your Name
 * Author URI:        https://example.com/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       quiznova
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

/**
 * Define Constants
 */
define( 'QUIZNOVA_VERSION', '1.0.0' );
define( 'QUIZNOVA_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'QUIZNOVA_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Include the initialization file for database setup.
require_once QUIZNOVA_PLUGIN_DIR . 'includes/quiznova-init.php';

// Register the activation hook to create database tables.
register_activation_hook( __FILE__, 'quiznova_create_tables' );

/**
 * Add the main menu page for QuizNova in the WordPress admin.
 */
function quiznova_admin_menu() {
    add_menu_page(
        __( 'QuizNova Dashboard', 'quiznova' ), // Page Title
        __( 'QuizNova', 'quiznova' ),           // Menu Title
        'manage_options',                       // Capability
        'quiznova',                             // Menu Slug
        'quiznova_admin_page_html',             // Callback function to render the page
        'dashicons-welcome-learn-more',         // Icon
        25                                      // Position
    );
}
add_action( 'admin_menu', 'quiznova_admin_menu' );

/**
 * The callback function to render the HTML for the admin page.
 * This is where our React app will be mounted.
 */
function quiznova_admin_page_html() {
    // We just need a root element for our React app.
    echo '<div id="quiznova-admin-app"></div>';
}

/**
 * Enqueue scripts and styles for the admin page.
 */
function quiznova_enqueue_admin_scripts( $hook ) {
    // Only load our scripts on the QuizNova admin page.
    if ( 'toplevel_page_quiznova' !== $hook ) {
        return;
    }

    // Enqueue our custom stylesheet.
    wp_enqueue_style(
        'quiznova-admin-style',
        QUIZNOVA_PLUGIN_URL . 'css/style.css',
        [],
        QUIZNOVA_VERSION
    );

    // Enqueue our main script file (the compiled React app).
    // WordPress includes React and ReactDOM, so we can list them as dependencies.
    wp_enqueue_script(
        'quiznova-admin-script',
        QUIZNOVA_PLUGIN_URL . 'js/script.js',
        [ 'wp-element', 'wp-components', 'wp-i18n' ], // Dependencies
        QUIZNOVA_VERSION,
        true // Load in footer
    );

    // (Optional but recommended) Pass data to our script, like API nonces for security.
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
