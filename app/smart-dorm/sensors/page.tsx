'use client'

import { Card } from '../components/Card'
import DataTable from '../components/DataTable'
import SetupAlert from '../components/SetupAlert'
import { useSmartDorm } from '../hooks/useSensorData'

export default function SensorsPage() {
  const { latest, sensors, loading, error, refresh } = useSmartDorm()

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="section-title">
          <div>
            <h3>传感器数据总览</h3>
            <p>温湿度、光照、烟雾、CO₂、识别状态和用电数据均来自 ESP32 上传。</p>
          </div>
          <button className="btn btn-primary" onClick={refresh}>立即刷新</button>
        </div>
      </section>
      <SetupAlert error={error} />
      {loading ? <div className="panel">正在加载数据...</div> : null}
      <section className="metric-grid">
        <Card title="温度" value={latest?.temperature ?? '-'} unit="℃" hint="AHT20" icon="🌡️" />
        <Card title="湿度" value={latest?.humidity ?? '-'} unit="%" hint="AHT20" icon="💧" />
        <Card title="光照" value={latest?.lux ?? '-'} unit="lx" hint="BH1750" icon="☀️" />
        <Card title="二氧化碳" value={latest?.co2 ?? '-'} unit="ppm" hint="SCD41" icon="🌿" />
        <Card title="烟雾值" value={latest?.mq2_value ?? '-'} unit="ADC" hint="MQ-2 AO" icon="♨️" />
        <Card title="电压" value={latest?.voltage ?? '-'} unit="V" hint="HLW8032" icon="🔋" />
        <Card title="电流" value={latest?.current_value ?? '-'} unit="A" hint="HLW8032" icon="〰" />
        <Card title="功率" value={latest?.power ?? '-'} unit="W" hint="HLW8032" icon="⚡" />
      </section>
      <DataTable logs={sensors} />
    </div>
  )
}
