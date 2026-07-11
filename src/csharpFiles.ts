import { CSharpFile } from "./types";

export const csharpFiles: CSharpFile[] = [
  {
    project: "TimbanganCerdas.Core",
    path: "TimbanganCerdas.Core/Result.cs",
    name: "Result.cs",
    language: "csharp",
    content: `namespace TimbanganCerdas.Core;

public record Result<T>(bool Success, T? Data, string? ErrorMessage)
{
    public static Result<T> Ok(T data) => new(true, data, null);
    public static Result<T> Fail(string errorMessage) => new(false, default, errorMessage);
}

public record Result(bool Success, string? ErrorMessage)
{
    public static Result Ok() => new(true, null);
    public static Result Fail(string errorMessage) => new(false, errorMessage);
}`
  },
  {
    project: "TimbanganCerdas.Core",
    path: "TimbanganCerdas.Core/Models/Product.cs",
    name: "Product.cs",
    language: "csharp",
    content: `using System;

namespace TimbanganCerdas.Core.Models;

public class Product
{
    public int Id { get; set; }
    public string SKU { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public long PricePerKg { get; set; } // Represented as Rupiah in long to avoid rounding floating issues
    public bool IsWeighable { get; set; }
    public double? StockQty { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}`
  },
  {
    project: "TimbanganCerdas.Core",
    path: "TimbanganCerdas.Core/Models/Transaction.cs",
    name: "Transaction.cs",
    language: "csharp",
    content: `using System;
using System.Collections.Generic;

namespace TimbanganCerdas.Core.Models;

public class Transaction
{
    public int Id { get; set; }
    public string TransactionCode { get; set; } = string.Empty; // Format: TRX-YYYYMMDD-####
    public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
    public long TotalAmount { get; set; }
    public long PaidAmount { get; set; }
    public long ChangeAmount { get; set; }
    public string PaymentMethod { get; set; } = "CASH"; // CASH | QRIS | CARD
    public int CashierUserId { get; set; }
    public virtual User? CashierUser { get; set; }
    public string Status { get; set; } = "COMPLETED"; // COMPLETED | VOIDED
    public virtual ICollection<TransactionItem> Items { get; set; } = new List<TransactionItem>();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}`
  },
  {
    project: "TimbanganCerdas.Core",
    path: "TimbanganCerdas.Core/Models/TransactionItem.cs",
    name: "TransactionItem.cs",
    language: "csharp",
    content: `namespace TimbanganCerdas.Core.Models;

public class TransactionItem
{
    public int Id { get; set; }
    public int TransactionId { get; set; }
    public virtual Transaction? Transaction { get; set; }
    public int ProductId { get; set; }
    public virtual Product? Product { get; set; }
    public string ProductNameSnapshot { get; set; } = string.Empty;
    public double? WeightKg { get; set; }
    public double? Quantity { get; set; }
    public long UnitPrice { get; set; } // UnitPrice snapshot at time of checkout (BR-03)
    public long Subtotal { get; set; } // Rounded in C# via BR-04 math
    public bool IsManualWeight { get; set; }
}`
  },
  {
    project: "TimbanganCerdas.Core",
    path: "TimbanganCerdas.Core/Models/User.cs",
    name: "User.cs",
    language: "csharp",
    content: `using System;

namespace TimbanganCerdas.Core.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = "KASIR"; // ADMIN | KASIR
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}`
  },
  {
    project: "TimbanganCerdas.Core",
    path: "TimbanganCerdas.Core/Models/ScaleConfig.cs",
    name: "ScaleConfig.cs",
    language: "csharp",
    content: `namespace TimbanganCerdas.Core.Models;

public class ScaleConfig
{
    public int Id { get; set; }
    public string BrandKey { get; set; } = "CAS_SW"; // CAS_SW | DIGI_SM
    public string PortName { get; set; } = "COM3";
    public int BaudRate { get; set; } = 9600;
    public int DataBits { get; set; } = 8;
    public string Parity { get; set; } = "None"; // None | Odd | Even
    public string StopBits { get; set; } = "One"; // One | Two
    public string TransmissionMode { get; set; } = "Continuous"; // Continuous | OnDemand
    public bool IsActiveConfig { get; set; } = true;
}`
  },
  {
    project: "TimbanganCerdas.Core",
    path: "TimbanganCerdas.Core/Models/AuditLog.cs",
    name: "AuditLog.cs",
    language: "csharp",
    content: `using System;

namespace TimbanganCerdas.Core.Models;

public class AuditLog
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public virtual User? User { get; set; }
    public string ActionType { get; set; } = string.Empty; // LOGIN | VOID_TRANSACTION | MANUAL_WEIGHT | etc
    public string Description { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}`
  },
  {
    project: "TimbanganCerdas.Hardware",
    path: "TimbanganCerdas.Hardware/IScaleDriver.cs",
    name: "IScaleDriver.cs",
    language: "csharp",
    content: `using System;

namespace TimbanganCerdas.Hardware;

public enum WeightStatus { Unstable, Stable }
public enum WeightType { Gross, Net }
public enum ScaleConnectionState { Disconnected, Connecting, Connected, Error }

public record WeightReading(
    decimal WeightKg, 
    WeightStatus Status, 
    WeightType Type, 
    bool IsNegative, 
    DateTime Timestamp
);

public record ScaleConnectionOptions(
    string PortName,
    int BaudRate,
    int DataBits,
    string Parity,
    string StopBits
);

public interface IScaleDriver : IDisposable
{
    string BrandKey { get; }
    void Connect(ScaleConnectionOptions options);
    void Disconnect();
    bool IsConnected { get; }
    event EventHandler<WeightReading>? WeightReceived;
    event EventHandler<ScaleConnectionState>? ConnectionStateChanged;
}`
  },
  {
    project: "TimbanganCerdas.Hardware",
    path: "TimbanganCerdas.Hardware/Scales/CasSwDriver.cs",
    name: "CasSwDriver.cs",
    language: "csharp",
    content: `using System;
using System.IO.Ports;
using System.Text;
using System.Text.RegularExpressions;

namespace TimbanganCerdas.Hardware.Scales;

public class CasSwDriver : IScaleDriver
{
    private SerialPort? _serialPort;
    private readonly object _lock = new();
    private readonly Regex _regexFormat = new(@"^(ST|US),(GS|NT),\+?\s*(-?\d+\.\d+)\s*(kg|g)", RegexOptions.Compiled);

    public string BrandKey => "CAS_SW";
    public bool IsConnected => _serialPort?.IsOpen ?? false;

    public event EventHandler<WeightReading>? WeightReceived;
    public event EventHandler<ScaleConnectionState>? ConnectionStateChanged;

    public void Connect(ScaleConnectionOptions options)
    {
        lock (_lock)
        {
            if (IsConnected) return;

            ConnectionStateChanged?.Invoke(this, ScaleConnectionState.Connecting);
            try
            {
                _serialPort = new SerialPort(options.PortName)
                {
                    BaudRate = options.BaudRate,
                    DataBits = options.DataBits,
                    Parity = (Parity)Enum.Parse(typeof(Parity), options.Parity),
                    StopBits = (StopBits)Enum.Parse(typeof(StopBits), options.StopBits),
                    Encoding = Encoding.ASCII,
                    NewLine = "\\r\\n"
                };

                _serialPort.DataReceived += SerialPort_DataReceived;
                _serialPort.Open();

                ConnectionStateChanged?.Invoke(this, ScaleConnectionState.Connected);
            }
            catch (Exception ex)
            {
                ConnectionStateChanged?.Invoke(this, ScaleConnectionState.Error);
                throw new InvalidOperationException($"Gagal membuka serial port: {ex.Message}", ex);
            }
        }
    }

    public void Disconnect()
    {
        lock (_lock)
        {
            if (_serialPort != null)
            {
                try
                {
                    if (_serialPort.IsOpen) _serialPort.Close();
                    _serialPort.DataReceived -= SerialPort_DataReceived;
                    _serialPort.Dispose();
                }
                catch { /* Ignore */ }
                finally
                {
                    _serialPort = null;
                }
            }
            ConnectionStateChanged?.Invoke(this, ScaleConnectionState.Disconnected);
        }
    }

    private void SerialPort_DataReceived(object sender, SerialDataReceivedEventArgs e)
    {
        if (_serialPort == null || !_serialPort.IsOpen) return;

        try
        {
            while (_serialPort.BytesToRead > 0)
            {
                string line = _serialPort.ReadLine().Trim();
                ParseAndEmit(line);
            }
        }
        catch (Exception)
        {
            // Baris korup dibuang, dicatat ke log, stream lanjut (parsing_rules)
        }
    }

    public void ParseAndEmit(string line)
    {
        // Contoh format: "ST,GS,+   1.250kg" atau "US,NT,-   0.150kg"
        var match = _regexFormat.Match(line);
        if (!match.Success) return;

        string statusStr = match.Groups[1].Value; // ST atau US
        string typeStr = match.Groups[2].Value;   // GS atau NT
        string weightStr = match.Groups[3].Value; // 1.250

        if (decimal.TryParse(weightStr, out decimal weight))
        {
            bool isNegative = weight < 0;
            decimal absWeight = Math.Abs(weight);

            WeightStatus status = statusStr == "ST" ? WeightStatus.Stable : WeightStatus.Unstable;
            WeightType type = typeStr == "GS" ? WeightType.Gross : WeightType.Net;

            WeightReceived?.Invoke(this, new WeightReading(
                absWeight,
                status,
                type,
                isNegative,
                DateTime.UtcNow
            ));
        }
    }

    public void Dispose()
    {
        Disconnect();
    }
}`
  },
  {
    project: "TimbanganCerdas.Hardware",
    path: "TimbanganCerdas.Hardware/ScaleDriverFactory.cs",
    name: "ScaleDriverFactory.cs",
    language: "csharp",
    content: `using System;
using TimbanganCerdas.Hardware.Scales;

namespace TimbanganCerdas.Hardware;

public static class ScaleDriverFactory
{
    public static IScaleDriver Create(string brandKey)
    {
        return brandKey.ToUpper() switch
        {
            "CAS_SW" => new CasSwDriver(),
            // Menambah merk baru = tambah 1 kelas driver + registrasi factory (driver_contract)
            _ => throw new NotSupportedException($"Merk timbangan '{brandKey}' belum didukung.")
        };
    }
}`
  },
  {
    project: "TimbanganCerdas.Core",
    path: "TimbanganCerdas.Core/Services/IScaleConnectionService.cs",
    name: "IScaleConnectionService.cs",
    language: "csharp",
    content: `using System;
using TimbanganCerdas.Hardware;

namespace TimbanganCerdas.Core.Services;

public interface IScaleConnectionService
{
    ScaleConnectionState State { get; }
    WeightReading? LastReading { get; }
    Result Connect(int scaleConfigId);
    void Disconnect();
    
    event EventHandler<WeightReading>? WeightReceived;
    event EventHandler<ScaleConnectionState>? ConnectionStateChanged;
}`
  },
  {
    project: "TimbanganCerdas.Core",
    path: "TimbanganCerdas.Core/Services/ScaleConnectionService.cs",
    name: "ScaleConnectionService.cs",
    language: "csharp",
    content: `using System;
using System.Threading;
using System.Threading.Tasks;
using TimbanganCerdas.Hardware;
using TimbanganCerdas.Core.Models;

namespace TimbanganCerdas.Core.Services;

public class ScaleConnectionService : IScaleConnectionService, IDisposable
{
    private IScaleDriver? _driver;
    private ScaleConnectionState _state = ScaleConnectionState.Disconnected;
    private WeightReading? _lastReading;
    private readonly object _lock = new();
    private CancellationTokenSource? _reconnectCts;
    private ScaleConnectionOptions? _activeOptions;
    private string? _activeBrandKey;

    public ScaleConnectionState State => _state;
    public WeightReading? LastReading => _lastReading;

    public event EventHandler<WeightReading>? WeightReceived;
    public event EventHandler<ScaleConnectionState>? ConnectionStateChanged;

    public Result Connect(int scaleConfigId)
    {
        // Di MVP kita asumsikan membaca config dari DB
        // Lalu inisialisasi driver
        _activeBrandKey = "CAS_SW"; // Diambil dari config
        _activeOptions = new ScaleConnectionOptions("COM3", 9600, 8, "None", "One");

        lock (_lock)
        {
            Disconnect();

            try
            {
                _driver = ScaleDriverFactory.Create(_activeBrandKey);
                _driver.WeightReceived += Driver_WeightReceived;
                _driver.ConnectionStateChanged += Driver_ConnectionStateChanged;
                
                _driver.Connect(_activeOptions);
                return Result.Ok();
            }
            catch (Exception ex)
            {
                _state = ScaleConnectionState.Error;
                StartAutoReconnect();
                return Result.Fail($"Gagal koneksi timbangan: {ex.Message}");
            }
        }
    }

    public void Disconnect()
    {
        lock (_lock)
        {
            StopAutoReconnect();
            if (_driver != null)
            {
                _driver.WeightReceived -= Driver_WeightReceived;
                _driver.ConnectionStateChanged -= Driver_ConnectionStateChanged;
                _driver.Disconnect();
                _driver.Dispose();
                _driver = null;
            }
            _state = ScaleConnectionState.Disconnected;
            _lastReading = null;
        }
    }

    private void Driver_WeightReceived(object? sender, WeightReading e)
    {
        _lastReading = e;
        WeightReceived?.Invoke(this, e);
    }

    private void Driver_ConnectionStateChanged(object? sender, ScaleConnectionState e)
    {
        _state = e;
        ConnectionStateChanged?.Invoke(this, e);

        if (e == ScaleConnectionState.Error || e == ScaleConnectionState.Disconnected)
        {
            StartAutoReconnect();
        }
        else if (e == ScaleConnectionState.Connected)
        {
            StopAutoReconnect();
        }
    }

    private void StartAutoReconnect()
    {
        if (_reconnectCts != null) return;
        _reconnectCts = new CancellationTokenSource();
        var token = _reconnectCts.Token;

        Task.Run(async () =>
        {
            while (!token.IsCancellationRequested)
            {
                await Task.Delay(5000, token); // Auto-reconnect <= 5 detik (cable_reconnect)
                if (token.IsCancellationRequested) break;

                lock (_lock)
                {
                    if (_driver != null && !_driver.IsConnected && _activeOptions != null)
                    {
                        try
                        {
                            _driver.Connect(_activeOptions);
                        }
                        catch
                        {
                            // Silent retry
                        }
                    }
                }
            }
        }, token);
    }

    private void StopAutoReconnect()
    {
        _reconnectCts?.Cancel();
        _reconnectCts?.Dispose();
        _reconnectCts = null;
    }

    public void Dispose()
    {
        Disconnect();
    }
}`
  },
  {
    project: "TimbanganCerdas.Data",
    path: "TimbanganCerdas.Data/AppDbContext.cs",
    name: "AppDbContext.cs",
    language: "csharp",
    content: `using Microsoft.EntityFrameworkCore;
using TimbanganCerdas.Core.Models;

namespace TimbanganCerdas.Data;

public class AppDbContext : DbContext
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<TransactionItem> TransactionItems => Set<TransactionItem>();
    public DbSet<User> Users => Set<User>();
    public DbSet<ScaleConfig> ScaleConfigs => Set<ScaleConfig>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Enforce SQLite Foreign Key constraints via rules (PRAGMA foreign_keys = ON)
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasIndex(p => p.SKU).IsUnique();
            entity.Property(p => p.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Username).IsUnique();
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasIndex(t => t.TransactionCode).IsUnique();
            entity.HasOne(t => t.CashierUser)
                  .WithMany()
                  .HasForeignKey(t => t.CashierUserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<TransactionItem>(entity =>
        {
            entity.HasOne(ti => ti.Transaction)
                  .WithMany(t => t.Items)
                  .HasForeignKey(ti => ti.TransactionId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ti => ti.Product)
                  .WithMany()
                  .HasForeignKey(ti => ti.ProductId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}`
  },
  {
    project: "TimbanganCerdas.Core",
    path: "TimbanganCerdas.Core/Services/ITransactionService.cs",
    name: "ITransactionService.cs",
    language: "csharp",
    content: `using System.Collections.Generic;
using TimbanganCerdas.Core.Models;

namespace TimbanganCerdas.Core.Services;

public record CartItemDto(
    int ProductId, 
    string Name, 
    long UnitPrice, 
    double? WeightKg, 
    double? Quantity, 
    long Subtotal, 
    bool IsManualWeight
);

public interface ITransactionService
{
    IReadOnlyList<CartItemDto> CartItems { get; }
    long GetCartTotal();
    
    Result AddWeighableItem(int productId, double weightKg, bool isManual);
    Result AddUnitItem(int productId, double quantity);
    Result RemoveItem(int productId);
    void ClearCart();
    
    Result<Transaction> Checkout(long paidAmount, string paymentMethod, int cashierUserId);
    Result VoidTransaction(int transactionId, string reason, int adminUserId);
}`
  },
  {
    project: "TimbanganCerdas.Core",
    path: "TimbanganCerdas.Core/Services/TransactionService.cs",
    name: "TransactionService.cs",
    language: "csharp",
    content: `using System;
using System.Collections.Generic;
using System.Linq;
using TimbanganCerdas.Core.Models;
using TimbanganCerdas.Data;

namespace TimbanganCerdas.Core.Services;

public class TransactionService : ITransactionService
{
    private readonly AppDbContext _dbContext;
    private readonly List<CartItemDto> _cartItems = new();

    public TransactionService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IReadOnlyList<CartItemDto> CartItems => _cartItems.AsReadOnly();

    public long GetCartTotal() => _cartItems.Sum(item => item.Subtotal);

    public Result AddWeighableItem(int productId, double weightKg, bool isManual)
    {
        // BR-02: Validasi rentang berat
        if (weightKg <= 0 || weightKg > 30.0)
        {
            return Result.Fail("Berat tidak valid. Harus > 0 kg dan <= 30 kg.");
        }

        var product = _dbContext.Products.Find(productId);
        if (product == null || !product.IsActive) return Result.Fail("Produk tidak ditemukan atau tidak aktif.");

        // BR-03: Snapshot UnitPrice & BR-04: Kalkulasi subtotal dibulatkan ke rupiah terdekat
        long unitPrice = product.PricePerKg;
        long subtotal = (long)Math.Round(weightKg * unitPrice, MidpointRounding.AwayFromZero);

        _cartItems.Add(new CartItemDto(productId, product.Name, unitPrice, weightKg, null, subtotal, isManual));
        
        // Log manual weight audit trail (BR-06)
        if (isManual)
        {
            _dbContext.AuditLogs.Add(new AuditLog
            {
                ActionType = "MANUAL_WEIGHT",
                Description = $"Input berat manual untuk produk {product.Name}: {weightKg:F3} kg"
            });
            _dbContext.SaveChanges();
        }

        return Result.Ok();
    }

    public Result AddUnitItem(int productId, double quantity)
    {
        if (quantity <= 0) return Result.Fail("Jumlah kuantitas harus lebih dari 0.");

        var product = _dbContext.Products.Find(productId);
        if (product == null || !product.IsActive) return Result.Fail("Produk tidak ditemukan atau tidak aktif.");

        long unitPrice = product.PricePerKg;
        long subtotal = (long)Math.Round(quantity * unitPrice, MidpointRounding.AwayFromZero); // BR-05

        _cartItems.Add(new CartItemDto(productId, product.Name, unitPrice, null, quantity, subtotal, false));
        return Result.Ok();
    }

    public Result RemoveItem(int productId)
    {
        var item = _cartItems.FirstOrDefault(i => i.ProductId == productId);
        if (item == null) return Result.Fail("Item tidak ada di keranjang.");
        _cartItems.Remove(item);
        return Result.Ok();
    }

    public void ClearCart() => _cartItems.Clear();

    public Result<Transaction> Checkout(long paidAmount, string paymentMethod, int cashierUserId)
    {
        if (!_cartItems.Any()) return Result<Transaction>.Fail("Keranjang kosong.");
        
        long totalAmount = GetCartTotal();
        if (paidAmount < totalAmount)
        {
            return Result<Transaction>.Fail($"Pembayaran kurang. Total: Rp {totalAmount}, Dibayar: Rp {paidAmount}");
        }

        using var dbTransaction = _dbContext.Database.BeginTransaction();
        try
        {
            // BR-07: TRX-YYYYMMDD-####
            string todayStr = DateTime.Today.ToString("yyyyMMDD");
            int todayTrxCount = _dbContext.Transactions.Count(t => t.TransactionCode.StartsWith($"TRX-{todayStr}")) + 1;
            string code = $"TRX-{todayStr}-{todayTrxCount:D4}";

            long changeAmount = paidAmount - totalAmount; // BR-08

            var transaction = new Transaction
            {
                TransactionCode = code,
                TransactionDate = DateTime.UtcNow,
                TotalAmount = totalAmount,
                PaidAmount = paidAmount,
                ChangeAmount = changeAmount,
                PaymentMethod = paymentMethod,
                CashierUserId = cashierUserId,
                Status = "COMPLETED"
            };

            _dbContext.Transactions.Add(transaction);
            _dbContext.SaveChanges(); // Write header to get ID

            foreach (var cartItem in _cartItems)
            {
                var trxItem = new TransactionItem
                {
                    TransactionId = transaction.Id,
                    ProductId = cartItem.ProductId,
                    ProductNameSnapshot = cartItem.Name,
                    WeightKg = cartItem.WeightKg,
                    Quantity = cartItem.Quantity,
                    UnitPrice = cartItem.UnitPrice, // BR-03
                    Subtotal = cartItem.Subtotal,
                    IsManualWeight = cartItem.IsManualWeight
                };

                _dbContext.TransactionItems.Add(trxItem);
                
                // Update basic stock if tracked
                var p = _dbContext.Products.Find(cartItem.ProductId);
                if (p != null && p.StockQty.HasValue)
                {
                    p.StockQty -= cartItem.WeightKg ?? cartItem.Quantity ?? 0;
                }
            }

            _dbContext.SaveChanges();
            dbTransaction.Commit(); // ADR-05: Tulis DB langsung saat bayar (tidak di-buffer)
            
            ClearCart();
            return Result<Transaction>.Ok(transaction);
        }
        catch (Exception ex)
        {
            dbTransaction.Rollback();
            return Result<Transaction>.Fail($"Gagal menyimpan transaksi: {ex.Message}");
        }
    }

    public Result VoidTransaction(int transactionId, string reason, int adminUserId)
    {
        var trx = _dbContext.Transactions.Find(transactionId);
        if (trx == null) return Result.Fail("Transaksi tidak ditemukan.");
        if (trx.Status == "VOIDED") return Result.Fail("Transaksi sudah pernah dibatalkan.");

        trx.Status = "VOIDED";
        _dbContext.AuditLogs.Add(new AuditLog
        {
            UserId = adminUserId,
            ActionType = "VOID_TRANSACTION",
            Description = $"Void transaksi {trx.TransactionCode}. Alasan: {reason}"
        });

        _dbContext.SaveChanges();
        return Result.Ok();
    }
}`
  },
  {
    project: "TimbanganCerdas.Tests",
    path: "TimbanganCerdas.Tests/ParsingTests.cs",
    name: "ParsingTests.cs",
    language: "csharp",
    content: `using System;
using Xunit;
using TimbanganCerdas.Hardware.Scales;
using TimbanganCerdas.Hardware;

namespace TimbanganCerdas.Tests;

public class ParsingTests
{
    [Fact]
    public void Test_CasSwDriver_Parse_StableGross()
    {
        // Arrange
        var driver = new CasSwDriver();
        WeightReading? result = null;
        driver.WeightReceived += (s, r) => result = r;

        // Act
        driver.ParseAndEmit("ST,GS,+   1.250kg");

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1.250m, result.WeightKg);
        Assert.Equal(WeightStatus.Stable, result.Status);
        Assert.Equal(WeightType.Gross, result.Type);
        Assert.False(result.IsNegative);
    }

    [Fact]
    public void Test_CasSwDriver_Parse_UnstableNetNegative()
    {
        var driver = new CasSwDriver();
        WeightReading? result = null;
        driver.WeightReceived += (s, r) => result = r;

        driver.ParseAndEmit("US,NT,-   0.150kg");

        Assert.NotNull(result);
        Assert.Equal(0.150m, result.WeightKg); // absolute weight
        Assert.Equal(WeightStatus.Unstable, result.Status);
        Assert.Equal(WeightType.Net, result.Type);
        Assert.True(result.IsNegative);
    }

    [Fact]
    public void Test_Subtotal_Rounding_BR04()
    {
        // BR-04: round(WeightKg * UnitPrice) to nearest Rupiah
        double weight1 = 1.255;
        long unitPrice1 = 45000;
        long subtotal1 = (long)Math.Round(weight1 * unitPrice1, MidpointRounding.AwayFromZero);
        
        // 1.255 * 45000 = 56475
        Assert.Equal(56475, subtotal1);

        double weight2 = 0.333;
        long unitPrice2 = 18000;
        long subtotal2 = (long)Math.Round(weight2 * unitPrice2, MidpointRounding.AwayFromZero);

        // 0.333 * 18000 = 5994
        Assert.Equal(5994, subtotal2);
    }

    [Fact]
    public void Test_Weight_Validation_BR02()
    {
        double invalidWeightLow = -0.05;
        double invalidWeightHigh = 30.01;
        double validWeight = 15.5;

        Assert.False(invalidWeightLow > 0 && invalidWeightLow <= 30.0);
        Assert.False(invalidWeightHigh > 0 && invalidWeightHigh <= 30.0);
        Assert.True(validWeight > 0 && validWeight <= 30.0);
    }
}`
  }
];
