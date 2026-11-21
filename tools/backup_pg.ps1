<#
.SYNOPSIS
    Script sao lưu định kỳ PostgreSQL Schema 'wms' trên Supabase.
.DESCRIPTION
    Script này thực hiện backup schema 'wms' về thư mục backup/pg_dumps dưới định dạng file SQL nén hoặc file plain text.
    Nếu hệ thống có sẵn pg_dump, script sẽ sử dụng pg_dump trực tiếp.
    Nếu chưa cài pg_dump, script sẽ tự động gọi tools/backup_pg.py thông qua psycopg3.
#>

param (
    [string]$DbUrl = $env:DATABASE_URL,
    [string]$Schema = "wms",
    [string]$OutputDir = "$PSScriptRoot\..\backup\pg_dumps"
)

if (-not $DbUrl) {
    # Default connection string if not in env
    $DbUrl = "postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
}

if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
}

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$OutputFile = "$OutputDir\backup_${Schema}_${Timestamp}.sql"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  SAO LƯU DỮ LIỆU POSTGRESQL (SCHEMA: $Schema)" -ForegroundColor Cyan
Write-Host "  Thời gian: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor Gray
Write-Host "  Đích lưu: $OutputFile" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# Kiểm tra xem có lệnh pg_dump không
$pgDumpCmd = Get-Command "pg_dump" -ErrorAction SilentlyContinue

if ($pgDumpCmd) {
    Write-Host "[1/2] Đang chạy pg_dump..." -ForegroundColor Yellow
    & pg_dump --dbname=$DbUrl --schema=$Schema --no-owner --no-privileges -f $OutputFile
    if ($LASTEXITCODE -eq 0) {
        $size = (Get-Item $OutputFile).Length / 1MB
        Write-Host "[2/2] Sao lưu hoàn tất thành công! Kích thước: $([math]::Round($size, 2)) MB" -ForegroundColor Green
    } else {
        Write-Host "pg_dump thất bại với mã lỗi $LASTEXITCODE" -ForegroundColor Red
    }
} else {
    Write-Host "[1/2] Không tìm thấy pg_dump CLI trên máy Windows. Đang dùng Python backup engine..." -ForegroundColor Yellow
    $pythonCmd = Get-Command "python" -ErrorAction SilentlyContinue
    if ($pythonCmd) {
        & python "$PSScriptRoot\backup_pg.py" --url "$DbUrl" --schema "$Schema" --output "$OutputFile"
    } else {
        Write-Host "Lỗi: Cần cài đặt pg_dump hoặc Python để thực hiện backup." -ForegroundColor Red
        exit 1
    }
}
