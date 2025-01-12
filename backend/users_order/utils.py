def camel_to_snake(d):
    """
    Convert keys of a dictionary from camelCase to snake_case.
    """
    new_dict = {}
    for key, value in d.items():
        new_key = ''.join(['_' + c.lower() if c.isupper() else c for c in key]).lstrip('_')
        new_dict[new_key] = value
    return new_dict

def snake_to_camel(d):
    camelcase_data = {}
    for key, value in d.items():
        camelcase_key = ''.join(word.capitalize() if i > 0 else word for i, word in enumerate(key.split('_')))
        camelcase_data[camelcase_key] = value
    return camelcase_data

def build_status_track(data):
    main_status  = data.get('status',None)
    status_track = []
    if main_status:
        main_status_track = main_status.get('status_track',None)
        if main_status_track:
            status_track+=main_status_track
    return status_track

def to_html_p(string):
    return f"<span>{string}</span>"