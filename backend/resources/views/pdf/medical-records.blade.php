<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Medical Records - {{ $patient['name'] }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .patient-info {
            margin-bottom: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
        .patient-info h2 {
            color: #2c3e50;
            margin-bottom: 15px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        .records {
            margin-top: 30px;
        }
        .record {
            margin-bottom: 25px;
            padding: 15px;
            border: 1px solid #dee2e6;
            page-break-inside: avoid;
        }
        .record-date {
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .record-doctor {
            color: #6c757d;
            font-style: italic;
            margin-bottom: 10px;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 0.9em;
            color: #6c757d;
        }
        .section {
            margin-bottom: 10px;
        }
        .section-title {
            font-weight: bold;
            color: #495057;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Medical Records Report</h1>
        <p>Generated on: {{ $generatedDate }}</p>
    </div>

    <div class="patient-info">
        <h2>Patient Information</h2>
        <div class="info-grid">
            <div>
                <p><strong>Name:</strong> {{ $patient['name'] }}</p>
                <p><strong>Date of Birth:</strong> {{ $patient['dateOfBirth'] }}</p>
                <p><strong>Gender:</strong> {{ $patient['gender'] }}</p>
                <p><strong>Email:</strong> {{ $patient['email'] }}</p>
            </div>
            <div>
                <p><strong>Phone:</strong> {{ $patient['phone'] }}</p>
                <p><strong>Address:</strong> {{ $patient['address'] }}</p>
                <p><strong>Emergency Contact:</strong> {{ $patient['emergencyContact']['name'] }}</p>
                <p><strong>Emergency Phone:</strong> {{ $patient['emergencyContact']['phone'] }}</p>
            </div>
        </div>
    </div>

    <div class="records">
        <h2>Medical History</h2>
        @foreach($records as $record)
            <div class="record">
                <div class="record-date">Visit Date: {{ $record['date'] }}</div>
                <div class="record-doctor">Attending Physician: {{ $record['doctorName'] }}</div>
                
                <div class="section">
                    <div class="section-title">Symptoms:</div>
                    <div>{{ $record['symptoms'] }}</div>
                </div>

                <div class="section">
                    <div class="section-title">Diagnosis:</div>
                    <div>{{ $record['diagnosis'] }}</div>
                </div>

                <div class="section">
                    <div class="section-title">Treatment:</div>
                    <div>{{ $record['treatment'] }}</div>
                </div>

                <div class="section">
                    <div class="section-title">Prescription:</div>
                    <div>{{ $record['prescription'] }}</div>
                </div>

                @if($record['notes'])
                    <div class="section">
                        <div class="section-title">Additional Notes:</div>
                        <div>{{ $record['notes'] }}</div>
                    </div>
                @endif
            </div>
        @endforeach
    </div>

    <div class="footer">
        <p>This is an official medical record document from CareLink Medical Center.</p>
        <p>Please keep this document for your records.</p>
    </div>
</body>
</html>
