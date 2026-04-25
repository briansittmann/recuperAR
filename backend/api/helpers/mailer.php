<?php
/**
 * Envía un email con un archivo adjunto usando MIME multipart.
 * No requiere PHPMailer ni librerías externas (compatible con Hostinger compartido).
 *
 * @param string $to       Destinatario
 * @param string $subject  Asunto
 * @param string $body     Cuerpo en texto plano
 * @param string $from     Remitente
 * @param string|null $attachmentPath  Ruta absoluta al archivo adjunto (opcional)
 * @param string|null $attachmentName  Nombre que verá el destinatario (opcional)
 * @return bool
 */
function sendEmail($to, $subject, $body, $from = 'noreply@recuperarsm.com.ar', $attachmentPath = null, $attachmentName = null) {
    $eol = "\r\n";

    if (!$attachmentPath) {
        $headers  = "From: $from$eol";
        $headers .= "MIME-Version: 1.0$eol";
        $headers .= "Content-Type: text/plain; charset=utf-8$eol";
        $headers .= "Content-Transfer-Encoding: 8bit$eol";
        return mail($to, $subject, $body, $headers);
    }

    if (!file_exists($attachmentPath) || !is_readable($attachmentPath)) {
        // Si el adjunto falla, mandamos el email igual sin archivo (no perdemos la notificación)
        return sendEmail($to, $subject, $body . "\n\n[No se pudo adjuntar el comprobante]", $from);
    }

    $boundary = '----=_NextBoundary_' . md5(uniqid((string) time()));

    $headers  = "From: $from$eol";
    $headers .= "MIME-Version: 1.0$eol";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"$eol";

    $fileContent = chunk_split(base64_encode(file_get_contents($attachmentPath)));
    $mimeType    = function_exists('mime_content_type')
        ? (mime_content_type($attachmentPath) ?: 'application/octet-stream')
        : 'application/octet-stream';
    $name        = $attachmentName ?: basename($attachmentPath);

    $message  = "--$boundary$eol";
    $message .= "Content-Type: text/plain; charset=utf-8$eol";
    $message .= "Content-Transfer-Encoding: 8bit$eol$eol";
    $message .= $body . $eol . $eol;

    $message .= "--$boundary$eol";
    $message .= "Content-Type: $mimeType; name=\"$name\"$eol";
    $message .= "Content-Transfer-Encoding: base64$eol";
    $message .= "Content-Disposition: attachment; filename=\"$name\"$eol$eol";
    $message .= $fileContent . $eol;
    $message .= "--$boundary--$eol";

    return mail($to, $subject, $message, $headers);
}
