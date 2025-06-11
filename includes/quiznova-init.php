<?php
function quiznova_enqueue_assets() {
    wp_enqueue_style('quiznova-style', plugin_dir_url(__FILE__) . '../css/style.css');
    wp_enqueue_script('quiznova-script', plugin_dir_url(__FILE__) . '../js/script.js', array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'quiznova_enqueue_assets');

function quiznova_activate() {
    global $wpdb;
    $table_name = $wpdb->prefix . "quiznova_quizzes";
    $charset_collate = $wpdb->get_charset_collate();
    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        title text NOT NULL,
        questions longtext NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
register_activation_hook(__FILE__, 'quiznova_activate');
?>
