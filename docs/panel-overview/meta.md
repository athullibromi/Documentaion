---
title: Meta
description: Manage metadata, custom fields, and data organization across your system
category: panel-overview
order: 4
tags: [meta, metadata, custom fields, data organization]
---

# Meta

The Meta section provides powerful tools for managing metadata, custom fields, and data organization across your entire system. This feature allows you to extend the default data structure with custom attributes, tags, and organizational elements.

## Overview

Meta functionality includes:
- Custom field creation and management
- Metadata organization and structure
- Data categorization and tagging
- Field validation and constraints
- Cross-system data relationships

## Custom Fields

### Creating Custom Fields

Add custom fields to extend your data structure:

1. Navigate to Meta > Custom Fields
2. Click "Create New Field"
3. Configure field properties:
   - **Field Name**: Unique identifier
   - **Display Label**: User-friendly name
   - **Field Type**: Data type and input method
   - **Description**: Help text for users
   - **Validation Rules**: Data constraints

### Field Types

#### Text Fields
- **Single Line Text**: Short text entries
- **Multi-line Text**: Longer text content
- **Rich Text**: Formatted text with HTML
- **Email**: Email address validation
- **URL**: Web address validation
- **Phone**: Phone number formatting

#### Numeric Fields
- **Integer**: Whole numbers
- **Decimal**: Numbers with decimal places
- **Currency**: Monetary values with formatting
- **Percentage**: Percentage values
- **Range**: Min/max value constraints

#### Date and Time
- **Date**: Calendar date selection
- **Time**: Time of day selection
- **DateTime**: Combined date and time
- **Duration**: Time period specification

#### Selection Fields
- **Dropdown**: Single selection from list
- **Multi-select**: Multiple selections allowed
- **Radio Buttons**: Single choice display
- **Checkboxes**: Multiple choice display
- **Tags**: Free-form tag entry

#### Advanced Fields
- **File Upload**: Document and media attachments
- **Image**: Image files with preview
- **JSON**: Structured data storage
- **Lookup**: References to other records
- **Formula**: Calculated values

### Field Configuration

#### Validation Rules
Set constraints for data quality:
- **Required Fields**: Must be filled
- **Unique Values**: No duplicates allowed
- **Format Patterns**: Regex validation
- **Value Ranges**: Min/max constraints
- **Character Limits**: Text length restrictions

#### Display Options
Control how fields appear:
- **Field Order**: Arrangement in forms
- **Conditional Display**: Show/hide based on other fields
- **Read-only**: Display but not editable
- **Hidden**: Store data without display
- **Grouping**: Organize related fields

#### Default Values
Set automatic field values:
- **Static Defaults**: Fixed values
- **Dynamic Defaults**: Calculated values
- **User-based**: Based on current user
- **Date-based**: Current date/time
- **Formula-based**: Calculated from other fields

## Metadata Management

### Metadata Structure

Organize your metadata hierarchically:

#### Categories
Create top-level groupings:
- Business categories
- Technical classifications
- Organizational divisions
- Project groupings
- Custom taxonomies

#### Subcategories
Add detailed organization:
- Nested category structures
- Multi-level hierarchies
- Cross-category relationships
- Dynamic categorization
- Inherited properties

#### Tags and Labels
Flexible classification system:
- **Free-form Tags**: User-defined labels
- **Controlled Vocabulary**: Predefined tag sets
- **Hierarchical Tags**: Nested tag structures
- **Auto-tagging**: Automatic tag assignment
- **Tag Relationships**: Related tag suggestions

### Metadata Templates

Create reusable metadata structures:

#### Template Creation
1. Define template name and description
2. Add required and optional fields
3. Set default values and validation
4. Configure display layout
5. Test and publish template

#### Template Types
- **Record Templates**: For data records
- **Project Templates**: For project metadata
- **User Templates**: For user profiles
- **Document Templates**: For file metadata
- **Custom Templates**: For specific use cases

## Data Organization

### Hierarchical Structure

Build organized data hierarchies:

#### Parent-Child Relationships
- Define relationship types
- Set inheritance rules
- Manage relationship constraints
- Handle circular references
- Maintain data integrity

#### Cross-References
Link related data across categories:
- Many-to-many relationships
- Bidirectional links
- Reference validation
- Automatic updates
- Relationship tracking

### Data Classification

Organize data systematically:

#### Classification Schemes
- **Functional Classification**: By purpose or use
- **Temporal Classification**: By time periods
- **Geographic Classification**: By location
- **Security Classification**: By access levels
- **Custom Classification**: By business rules

#### Auto-Classification
Automatic data organization:
- Rule-based classification
- Machine learning classification
- Pattern recognition
- Content analysis
- Behavioral classification

## Field Management

### Field Lifecycle

Manage custom fields throughout their lifecycle:

#### Creation Phase
- Requirements gathering
- Field design and specification
- Validation rule definition
- Testing and validation
- Deployment planning

#### Active Phase
- Usage monitoring
- Performance optimization
- User feedback collection
- Maintenance and updates
- Data quality monitoring

#### Retirement Phase
- Deprecation planning
- Data migration
- Field archival
- Historical data preservation
- System cleanup

### Field Dependencies

Manage relationships between fields:

#### Conditional Logic
- Show/hide fields based on values
- Enable/disable field editing
- Change validation rules dynamically
- Update field options
- Trigger calculations

#### Calculated Fields
Create fields with automatic values:
- Mathematical calculations
- String concatenations
- Date calculations
- Lookup values
- Complex formulas

## Data Validation

### Validation Rules

Ensure data quality and consistency:

#### Built-in Validators
- Data type validation
- Format validation
- Range validation
- Length validation
- Pattern matching

#### Custom Validators
- Business rule validation
- Cross-field validation
- External system validation
- Complex logic validation
- API-based validation

#### Validation Messages
Provide clear feedback:
- Error message customization
- Multi-language support
- Context-sensitive help
- Validation hints
- Progressive disclosure

## Import and Export

### Data Import

Import metadata and custom field data:

#### Import Formats
- CSV files
- Excel spreadsheets
- JSON data
- XML files
- API imports

#### Import Mapping
- Field mapping interface
- Data transformation rules
- Validation during import
- Error handling
- Import preview

### Data Export

Export metadata for external use:

#### Export Options
- Full data export
- Filtered exports
- Template exports
- Schema exports
- Scheduled exports

#### Export Formats
- CSV for spreadsheets
- JSON for APIs
- XML for systems integration
- PDF for documentation
- Custom formats

## API Integration

### Meta API

Programmatic access to metadata:

#### Field Management API
```javascript
// Create custom field
POST /api/v1/meta/fields
{
  "name": "project_priority",
  "type": "dropdown",
  "options": ["High", "Medium", "Low"],
  "required": true
}

// Get field definition
GET /api/v1/meta/fields/project_priority

// Update field options
PUT /api/v1/meta/fields/project_priority
{
  "options": ["Critical", "High", "Medium", "Low"]
}
```

#### Data API
```javascript
// Set metadata values
POST /api/v1/records/{id}/meta
{
  "project_priority": "High",
  "custom_category": "Development"
}

// Get metadata
GET /api/v1/records/{id}/meta

// Query by metadata
GET /api/v1/records?meta.project_priority=High
```

## Performance Optimization

### Indexing Strategy

Optimize metadata queries:
- Index frequently queried fields
- Composite indexes for complex queries
- Partial indexes for filtered data
- Text indexes for search functionality
- Regular index maintenance

### Caching

Improve performance with caching:
- Field definition caching
- Metadata value caching
- Query result caching
- Template caching
- Validation rule caching

## Security and Permissions

### Field-Level Security

Control access to custom fields:
- Read permissions
- Write permissions
- Field visibility rules
- Role-based access
- Dynamic permissions

### Data Privacy

Protect sensitive metadata:
- Data encryption
- Access logging
- Data masking
- Retention policies
- Compliance tracking

## Best Practices

### Field Design
- Use clear, descriptive field names
- Provide helpful descriptions
- Set appropriate validation rules
- Consider future extensibility
- Test thoroughly before deployment

### Data Organization
- Create logical hierarchies
- Use consistent naming conventions
- Implement proper categorization
- Maintain data relationships
- Regular cleanup and maintenance

### Performance
- Index frequently queried fields
- Limit the number of custom fields
- Use appropriate field types
- Monitor query performance
- Optimize data structures

## Troubleshooting

### Common Issues

#### Field Creation Problems
- Check field name uniqueness
- Verify data type compatibility
- Review validation rules
- Test with sample data
- Check system permissions

#### Performance Issues
- Review indexing strategy
- Optimize query patterns
- Check data volume
- Monitor system resources
- Consider data archival

#### Data Quality Issues
- Review validation rules
- Check import processes
- Audit data entry procedures
- Implement data cleansing
- Monitor data consistency

## Related Resources

- [Data Management](/api-reference/endpoints/data)
- [User Management](/panel-overview/contacts)
- [Analytics](/panel-overview/analytics)
- [Settings](/panel-overview/settings)