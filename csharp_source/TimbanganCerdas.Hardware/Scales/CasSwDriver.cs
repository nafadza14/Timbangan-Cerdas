using System;
using System.IO.Ports;
using System.Text;
using System.Text.RegularExpressions;

namespace TimbanganCerdas.Hardware.Scales;

public class CasSwDriver : IDisposable
{
    private SerialPort? _serialPort;
    private readonly object _lock = new();
    private readonly Regex _regexFormat = new(@"^(ST|US),(GS|NT),\+?\s*(-?\d+\.\d+)\s*(kg|g)", RegexOptions.Compiled);

    public string BrandKey => "CAS_SW";
    public bool IsConnected => _serialPort?.IsOpen ?? false;

    public event EventHandler<string>? RawDataReceived;
    public event EventHandler<bool>? ConnectionChanged;

    public void Connect(string portName, int baudRate = 9600)
    {
        lock (_lock)
        {
            if (IsConnected) return;

            try
            {
                _serialPort = new SerialPort(portName)
                {
                    BaudRate = baudRate,
                    DataBits = 8,
                    Parity = Parity.None,
                    StopBits = StopBits.One,
                    Encoding = Encoding.ASCII,
                    NewLine = "\r\n"
                };

                _serialPort.DataReceived += SerialPort_DataReceived;
                _serialPort.Open();

                ConnectionChanged?.Invoke(this, true);
            }
            catch (Exception ex)
            {
                ConnectionChanged?.Invoke(this, false);
                throw new InvalidOperationException($"Gagal membuka serial port {portName}: {ex.Message}", ex);
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
            ConnectionChanged?.Invoke(this, false);
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
                RawDataReceived?.Invoke(this, line);
            }
        }
        catch (Exception)
        {
            // Baris korup dibuang, dicatat ke log, stream lanjut (parsing_rules)
        }
    }

    public void Dispose()
    {
        Disconnect();
    }
}
